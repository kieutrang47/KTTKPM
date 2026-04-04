const express = require('express');
const { Pool } = require('pg');
const amqp = require('amqplib');
const app = express();
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'product_db',
    port: 5432
});

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

const initDB = async () => {
    let retries = 5;
    while(retries) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS products (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(200) NOT NULL,
                    description TEXT,
                    price DECIMAL(10,2) NOT NULL,
                    stock INT DEFAULT 0
                )
            `);
            console.log("✅ Product DB connected and table created");
            
            // Seed data
            const res = await pool.query("SELECT COUNT(*) FROM products");
            if(parseInt(res.rows[0].count) === 0) {
                await pool.query("INSERT INTO products (name, description, price, stock) VALUES ('Laptop Gaming X', 'Cool laptop', 1500.00, 10)");
                await pool.query("INSERT INTO products (name, description, price, stock) VALUES ('Mechanical Keyboard', 'Click clack', 100.00, 50)");
            }
            break;
        } catch (err) {
            console.log("Waiting for DB...");
            retries -= 1;
            await new Promise(res => setTimeout(res, 2000));
        }
    }
};

const connectRabbitMQ = async () => {
    let retries = 5;
    while(retries) {
        try {
            const conn = await amqp.connect(RABBITMQ_URL);
            const channel = await conn.createChannel();
            const queue = "ORDER_CREATED_QUEUE";
            
            await channel.assertQueue(queue, { durable: true });
            console.log("✅ Product Service is listening to RabbitMQ for ORDER_CREATED events");
            
            channel.consume(queue, async (msg) => {
                if(msg !== null) {
                    const orderData = JSON.parse(msg.content.toString());
                    console.log(`\n📨 Received RabbitMQ Event: ORDER_CREATED for Order #${orderData.id}`);
                    
                    try {
                        const productId = orderData.product_id;
                        const qty = orderData.quantity;
                        
                        // Deduct stock
                        await pool.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [qty, productId]);
                        console.log(`📉 Stock deducted for product #${productId} by ${qty}`);
                        
                        channel.ack(msg);
                    } catch (err) {
                        console.error("❌ Failed to process message", err);
                        // Optional: channel.nack(msg)
                    }
                }
            });
            break;
        } catch(err) {
            console.log("Waiting for RabbitMQ...");
            retries -= 1;
            await new Promise(res => setTimeout(res, 3000));
        }
    }
}

app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch(err) { res.status(500).json({error: err.message}); }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id]);
        if(result.rows.length === 0) return res.status(404).json({error: "Product not found"});
        res.json(result.rows[0]);
    } catch(err) { res.status(500).json({error: err.message}); }
});

app.post('/api/products', async (req, res) => {
    const { name, description, price, stock } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products(name, description, price, stock) VALUES($1, $2, $3, $4) RETURNING *',
            [name, description, price, stock]
        );
        res.status(201).json(result.rows[0]);
    } catch(err) { res.status(500).json({error: err.message}); }
});

initDB().then(() => connectRabbitMQ()).then(() => {
    app.listen(3001, () => console.log('📦 Product Service running at 3001'));
});

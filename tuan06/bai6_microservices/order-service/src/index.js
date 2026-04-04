const express = require('express');
const { Pool } = require('pg');
const amqp = require('amqplib');
const axios = require('axios');
const app = express();
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'order_db',
    port: 5432
});

const CUSTOMER_SVC_URL = process.env.CUSTOMER_SVC_URL || 'http://localhost:3003';
const PRODUCT_SVC_URL = process.env.PRODUCT_SVC_URL || 'http://localhost:3001';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
let rabbitChannel = null;

const initDB = async () => {
    let retries = 5;
    while(retries) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS orders (
                    id SERIAL PRIMARY KEY,
                    customer_id INT NOT NULL,
                    product_id INT NOT NULL,
                    quantity INT NOT NULL,
                    status VARCHAR(50) DEFAULT 'PENDING'
                )
            `);
            console.log("✅ Order DB connected and table created");
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
            rabbitChannel = await conn.createChannel();
            await rabbitChannel.assertQueue("ORDER_CREATED_QUEUE", { durable: true });
            console.log("✅ Order Service connected to RabbitMQ");
            break;
        } catch(err) {
            console.log("Waiting for RabbitMQ...");
            retries -= 1;
            await new Promise(res => setTimeout(res, 3000));
        }
    }
}

app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
        res.json(result.rows);
    } catch(err) { res.status(500).json({error: err.message}); }
});

app.post('/api/orders', async (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    if (!customer_id || !product_id || !quantity) return res.status(400).json({error: "Need customer_id, product_id, quantity"});

    try {
        // 1. Synchronously validate Customer via REST API
        console.log(`Checking customer ${customer_id}...`);
        const customerResult = await axios.get(`${CUSTOMER_SVC_URL}/api/customers/${customer_id}`).catch(()=>null);
        if(!customerResult) return res.status(404).json({error: "Customer not found"});
        
        // 2. Synchronously check Product stock via REST API
        console.log(`Checking product ${product_id}...`);
        const productResult = await axios.get(`${PRODUCT_SVC_URL}/api/products/${product_id}`).catch(()=>null);
        if(!productResult) return res.status(404).json({error: "Product not found"});
        
        if(productResult.data.stock < quantity) {
            return res.status(400).json({error: "Not enough stock"});
        }

        // 3. Create Order in local DB
        const result = await pool.query(
            'INSERT INTO orders(customer_id, product_id, quantity, status) VALUES($1, $2, $3, $4) RETURNING *',
            [customer_id, product_id, quantity, 'CREATED']
        );
        const newOrder = result.rows[0];

        // 4. Asynchronously Publish Event to Message Broker
        if(rabbitChannel) {
            rabbitChannel.sendToQueue("ORDER_CREATED_QUEUE", Buffer.from(JSON.stringify(newOrder)));
            console.log(`🚀 Published ORDER_CREATED event to RabbitMQ for Order #${newOrder.id}`);
        }

        res.status(201).json({
            message: "Order placed successfully!",
            order: newOrder,
            customer_name: customerResult.data.name,
            product_name: productResult.data.name
        });
    } catch(err) { res.status(500).json({error: err.message}); }
});

initDB().then(() => connectRabbitMQ()).then(() => {
    app.listen(3002, () => console.log('🛒 Order Service running at 3002'));
});

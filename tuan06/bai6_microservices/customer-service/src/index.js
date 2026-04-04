const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'customer_db',
    port: 5432
});

const initDB = async () => {
    let retries = 5;
    while(retries) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS customers (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    address VARCHAR(200)
                )
            `);
            console.log("✅ Customer DB connected and table created");
            
            // Seed data
            const res = await pool.query("SELECT COUNT(*) FROM customers");
            if(parseInt(res.rows[0].count) === 0) {
                await pool.query("INSERT INTO customers (name, email, address) VALUES ('Nguyen Van A', 'a@gmail.com', '123 Main St')");
            }
            break;
        } catch (err) {
            console.log("Waiting for DB...");
            retries -= 1;
            await new Promise(res => setTimeout(res, 2000));
        }
    }
};

app.get('/api/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');
        res.json(result.rows);
    } catch(err) { res.status(500).json({error: err.message}); }
});

app.get('/api/customers/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers WHERE id=$1', [req.params.id]);
        if(result.rows.length === 0) return res.status(404).json({error: "Customer not found"});
        res.json(result.rows[0]);
    } catch(err) { res.status(500).json({error: err.message}); }
});

app.post('/api/customers', async (req, res) => {
    const { name, email, address } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO customers(name, email, address) VALUES($1, $2, $3) RETURNING *',
            [name, email, address]
        );
        res.status(201).json(result.rows[0]);
    } catch(err) { res.status(500).json({error: err.message}); }
});

app.delete('/api/customers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM customers WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch(err) { res.status(500).json({error: err.message}); }
});

initDB().then(() => {
    app.listen(3003, () => console.log('👤 Customer Service running at 3003'));
});

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8000;

app.use('/api/products', createProxyMiddleware({ target: 'http://product-service:3001', changeOrigin: true }));
app.use('/api/orders', createProxyMiddleware({ target: 'http://order-service:3002', changeOrigin: true }));
app.use('/api/customers', createProxyMiddleware({ target: 'http://customer-service:3003', changeOrigin: true }));

app.get('/', (req, res) => res.send('API Gateway is running. Endpoints: /api/products, /api/orders, /api/customers'));

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running at http://localhost:${PORT}`);
});

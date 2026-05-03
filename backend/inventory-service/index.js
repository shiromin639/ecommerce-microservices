const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Đã kết nối MongoDB cho Inventory Service'))
    .catch((err) => console.error('Lỗi kết nối DB:', err));

// Kết nối Router
const inventoryRoute = require('./routes/inventory');
app.use('/api/inventory', inventoryRoute);

// Khởi động server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Inventory Service đang chạy tại cổng ${PORT}`);
});
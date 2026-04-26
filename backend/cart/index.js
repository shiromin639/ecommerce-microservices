const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Đã kết nối MongoDB cho Cart Service'))
    .catch((err) => console.error('❌ Lỗi kết nối DB:', err));

// --- DÒNG NÀY ĐỂ KẾT NỐI ROUTER ---
const cartRoute = require('./routes/cart'); 
app.use('/api/cart', cartRoute); // Mọi request bắt đầu bằng /api/cart sẽ chui vào file cart.js xử lý
// -----------------------------------------

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Cart Service đang chạy tại cổng ${PORT}`);
});
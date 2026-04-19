require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json()); // server đọc được dữ liệu JSON gửi lên

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Kết nối MongoDB thành công"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// Sử dụng Routes
app.use('/api/users', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));
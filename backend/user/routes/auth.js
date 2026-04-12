const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); 
// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // encode password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'email không hợp lệ' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        // create and assign a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username} });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. API Lấy thông tin cá nhân (Profile)
// Method: GET | URL: /api/users/profile
router.get('/profile', auth, async (req, res) => {
    try {
        // req.user.id lấy từ middleware auth sau khi giải mã token
        const user = await User.findById(req.user.id).select('-password'); // Không trả về mật khẩu
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});


// 2. API Xác thực nội bộ 
// Method: POST | URL: /api/users/verify
router.post('/verify', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ valid: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Trả về thông tin cơ bản để service khác sử dụng
        res.json({ valid: true, userId: decoded.id });
    } catch (err) {
        res.json({ valid: false });
    }
});

// 3. API Cập nhật thông tin 
// Method: PUT | URL: /api/users/update
router.put('/update', auth, async (req, res) => {
    const { username } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        user.username = username || user.username;
        await user.save();
        res.json({ message: "Cập nhật thành công", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
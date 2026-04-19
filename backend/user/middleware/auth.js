const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        // decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Lưu thông tin user (đã giải mã) vào request để các hàm sau sử dụng
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
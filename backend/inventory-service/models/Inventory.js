const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    productId: { 
        type: String, 
        required: true,
        unique: true // Mỗi sản phẩm chỉ có 1 bản ghi kho
    },
    stock: { 
        type: Number, 
        required: true,
        default: 0,
        min: 0 // Số lượng tồn kho không thể âm
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
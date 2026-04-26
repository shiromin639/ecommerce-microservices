const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true,
        unique: true // Mỗi user chỉ có 1 giỏ hàng active
    },
    items: [{
        productId: { 
            type: String, 
            required: true 
        },
        quantity: { 
            type: Number, 
            default: 1,
            min: 1
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
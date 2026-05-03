const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory'); // Đảm bảo bạn đã có file model này như hướng dẫn trước đó

// 1. API: THÊM HÀNG VÀO KHO (Dùng khi nhập hàng)
// Phương thức: POST
router.post('/', async (req, res) => {
    try {
        const { productId, stock } = req.body;

        if (stock < 0) {
            return res.status(400).json({ message: "Số lượng nhập kho không được âm" });
        }

        // Tìm xem sản phẩm đã có trong kho chưa
        let inventoryItem = await Inventory.findOne({ productId });

        if (inventoryItem) {
            // Nếu có rồi thì cộng dồn số lượng
            inventoryItem.stock += stock;
            await inventoryItem.save();
            return res.status(200).json(inventoryItem);
        } else {
            // Nếu chưa có thì tạo mới
            const newItem = await Inventory.create({ productId, stock });
            return res.status(201).json(newItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi thêm hàng vào kho" });
    }
});

// 2. API: LẤY SỐ LƯỢNG TỒN KHO CỦA MỘT SẢN PHẨM
// Phương thức: GET
router.get('/:productId', async (req, res) => {
    try {
        const inventoryItem = await Inventory.findOne({ productId: req.params.productId });
        
        if (!inventoryItem) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại trong kho", stock: 0 });
        }
        
        res.status(200).json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi kiểm tra kho" });
    }
});

// 3. API: TRỪ KHO (Dùng khi có người đặt mua thành công)
// Phương thức: PUT
router.put('/deduct', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).json({ message: "Số lượng trừ kho phải lớn hơn 0" });
        }

        const inventoryItem = await Inventory.findOne({ productId });

        if (!inventoryItem) {
            return res.status(404).json({ message: "Sản phẩm không có trong kho" });
        }

        // Kiểm tra xem kho có đủ hàng để trừ không
        if (inventoryItem.stock < quantity) {
            return res.status(400).json({ 
                message: "Không đủ hàng trong kho", 
                currentStock: inventoryItem.stock 
            });
        }

        // Thực hiện trừ kho
        inventoryItem.stock -= quantity;
        await inventoryItem.save();

        res.status(200).json({ message: "Trừ kho thành công", inventoryItem });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi trừ kho" });
    }
});

module.exports = router;
import { createSlice } from '@reduxjs/toolkit'

const savedCart = localStorage.getItem('cart')
const initialState = {
  items: savedCart ? JSON.parse(savedCart) : [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item.id === action.payload.id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, action.payload.stock)
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id)
        } else {
          item.quantity = Math.min(quantity, item.stock)
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cart')
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartTotal = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export default cartSlice.reducer

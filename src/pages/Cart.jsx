// src/pages/Cart.jsx
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const [orderResult, setOrderResult] = useState(null)

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const placeOrder = async () => {
    const order = {
      items: cart.map(item => ({
        item_id: item.id,
        quantity: item.quantity
      })),
      total: calculateTotal()
    }

    try {
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      })
      const result = await response.json()
      setOrderResult(result)
    } catch (error) {
      console.error('Error placing order:', error)
    }
  }

  if (orderResult) {
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Order Successful!</h2>
        <p className="mb-2">Total: ${orderResult.order.total.toFixed(2)}</p>
        {orderResult.order.discount_applied && (
          <p className="text-green-600">Discount Applied: {orderResult.order.discount_applied}</p>
        )}
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p>${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Order Summary</h3>
            <p className="text-lg">Total: ${calculateTotal().toFixed(2)}</p>
            <button
              onClick={placeOrder}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
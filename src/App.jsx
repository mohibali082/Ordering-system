// src/App.jsx
import { Outlet, Link } from 'react-router-dom'
import { useCart } from './context/CartContext'

export default function App() {
  const { cart } = useCart()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">ShopEasy</h1>
          <nav className="flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Browse</Link>
            <Link to="/cart" className="text-gray-700 hover:text-indigo-600">
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </Link>
            <Link to="/staff" className="text-gray-700 hover:text-indigo-600">Staff</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
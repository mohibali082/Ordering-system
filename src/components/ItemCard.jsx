// src/components/ItemCard.jsx
export default function ItemCard({ item, onAddToCart }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <h3 className="text-lg font-medium mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-2">${item.price.toFixed(2)}</p>
        <p className={`mb-4 ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
        </p>
        <button
          onClick={() => onAddToCart(item)}
          disabled={item.stock <= 0}
          className={`px-4 py-2 rounded ${item.stock > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Add to Cart
        </button>
      </div>
    )
  }
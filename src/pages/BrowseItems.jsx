// src/pages/BrowseItems.jsx
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import ItemCard from '../components/ItemCard'

export default function BrowseItems() {
  const [items, setItems] = useState([])
  const [offers, setOffers] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    fetch('http://localhost:8000/items')
      .then(res => res.json())
      .then(data => setItems(data))
    
    fetch('http://localhost:8000/offers')
      .then(res => res.json())
      .then(data => setOffers(data))
  }, [])

  return (
    <div>
      {offers.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="text-lg font-medium text-yellow-800">Special Offers</h3>
          <ul className="mt-2 list-disc pl-5">
            {offers.map(offer => (
              <li key={offer.id} className="text-yellow-700">{offer.name}</li>
            ))}
          </ul>
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-6">Available Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            onAddToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  )
}
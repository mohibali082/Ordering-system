// src/pages/StaffManagement.jsx
import { useState, useEffect } from 'react'
import ItemManagement from '../components/ItemManagement'
import OfferManagement from '../components/OfferManagement'

export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState('items')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Staff Management</h2>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'items' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'offers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Offers
          </button>
        </nav>
      </div>
      
      {activeTab === 'items' ? <ItemManagement /> : <OfferManagement />}
    </div>
  )
}
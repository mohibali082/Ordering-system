// src/components/OfferManagement.jsx
import { useState, useEffect } from 'react'

export default function OfferManagement() {
  const [offers, setOffers] = useState([])
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    condition: { min_total: '' },
    discount: { type: 'percentage', value: '' }
  })
  const [action, setAction] = useState('add')

  useEffect(() => {
    fetch('http://localhost:8000/offers')
      .then(res => res.json())
      .then(data => setOffers(data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const offer = {
      id: formData.id,
      name: formData.name,
      condition: {
        min_total: parseFloat(formData.condition.min_total)
      },
      discount: {
        type: formData.discount.type,
        value: parseFloat(formData.discount.value)
      }
    }

    try {
      const response = await fetch('http://localhost:8000/offers-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...offer,
          action
        })
      })
      const result = await response.json()
      alert(result.message)
      setFormData({
        id: '',
        name: '',
        condition: { min_total: '' },
        discount: { type: 'percentage', value: '' }
      })
      fetch('http://localhost:8000/offers')
        .then(res => res.json())
        .then(data => setOffers(data))
    } catch (error) {
      console.error('Error managing offer:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this offer?')) return
    try {
      const response = await fetch('http://localhost:8000/offers-management', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer_id: id })
      })
      const result = await response.json()
      alert(result.message)
      fetch('http://localhost:8000/offers')
        .then(res => res.json())
        .then(data => setOffers(data))
    } catch (error) {
      console.error('Error deleting offer:', error)
    }
  }

  const loadOfferForEdit = (offer) => {
    setFormData({
      id: offer.id,
      name: offer.name,
      condition: { min_total: offer.condition.min_total?.toString() || '' },
      discount: {
        type: offer.discount.type,
        value: offer.discount.value.toString()
      }
    })
    setAction('update')
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">{action === 'add' ? 'Add New Offer' : 'Update Offer'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({...formData, id: e.target.value})}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Order Total</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.condition.min_total}
              onChange={(e) => setFormData({
                ...formData,
                condition: { ...formData.condition, min_total: e.target.value }
              })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Type</label>
            <select
              value={formData.discount.type}
              onChange={(e) => setFormData({
                ...formData,
                discount: { ...formData.discount, type: e.target.value }
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {formData.discount.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.discount.value}
              onChange={(e) => setFormData({
                ...formData,
                discount: { ...formData.discount, value: e.target.value }
              })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {action === 'add' ? 'Add Offer' : 'Update Offer'}
          </button>
          {action === 'update' && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: '',
                  name: '',
                  condition: { min_total: '' },
                  discount: { type: 'percentage', value: '' }
                })
                setAction('add')
              }}
              className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Current Offers</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Min Total: ${offer.condition.min_total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {offer.discount.type === 'percentage' 
                      ? `${offer.discount.value}% off` 
                      : `$${offer.discount.value} off`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => loadOfferForEdit(offer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
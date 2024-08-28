import React from 'react'

function PropertiesForm() {
  return (
    <>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Property Form Fields */}
          {Object.keys(propertyData).map((key) => (
            <div key={key}>
              <label className="block text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type={key.includes('Date') ? 'date' : 'text'}
                name={key}
                value={propertyData[key]}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                required
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save Property
        </button>
      </form>
    </>
  )
}

export default PropertiesForm
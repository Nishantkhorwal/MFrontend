import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

export default function PropertiesTable() {
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    tenantName: '',
    tenantPhoneNumber: '',
    location: '',
    price: '',
    startDate: '',
    endDate: '',
    totalRent: '',
    rentPaid: ''
  });

  const [properties, setProperties] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [rentDueProperties, setRentDueProperties] = useState([]);
  const [showNearDuePopup, setShowNearDuePopup] = useState(false);
  const [nearDueProperties, setNearDueProperties] = useState([]);

  // Fetch all properties from the backend when the component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/properties');
        const data = await response.json();
        setProperties(data);
        checkRentDue(data); // Check for rent due after fetching
        checkNearDue(data); // Check for properties near due
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const checkRentDue = (properties) => {
    // Filter properties where rentPaid is less than totalRent
    const dueProperties = properties.filter(property => property.totalRent > property.rentPaid);
    setRentDueProperties(dueProperties);
    if (dueProperties.length > 0) {
      setShowPopup(true);
    }
  };

  const checkNearDue = (properties) => {
    // Filter properties where endDate is within 5 days
    const nearDueProperties = properties.filter(property => calculateDaysRemaining(property.endDate) <= 5);
    setNearDueProperties(nearDueProperties);
    if (nearDueProperties.length > 0) {
      setShowNearDuePopup(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({ ...propertyData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        const newProperty = await response.json();
        setProperties([...properties, newProperty]); // Add the new property to the state
        setPropertyData({
          propertyName: '',
          tenantName: '',
          tenantPhoneNumber: '',
          location: '',
          price: '',
          startDate: '',
          endDate: '',
          totalRent: '',
          rentPaid: '',
        });
        checkRentDue([...properties, newProperty]); // Check for rent due after adding
        checkNearDue([...properties, newProperty]); // Check for near due after adding
      } else {
        console.error('Failed to save the property');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeNearDuePopup = () => {
    setShowNearDuePopup(false);
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  return (
    <> 
      
      <div className='bg-gray-100 py-10'>
        {/* <Navbar/>  */}
        <div className="container mx-auto p-4">
          <h1 className="text-6xl font-bold mb-10 text-start">Properties</h1>

          {/* Render Property Cards */}
          <div className="flex flex-row flex-wrap gap-x-10 gap-y-8 w-full">
            {properties.map((property) => (
              <Link onClick={() => window.location.href = `/property/${property._id}`} key={property._id} className="w-[30%] bg-red-600 shadow-lg rounded-lg p-6">
                <h2 className="text-4xl font-bold mb-2">{property.propertyName}</h2>
                <hr className='mb-4' />
                <img src={property.imageUrl} alt={property.propertyName} className="h-[200px] mb-5 rounded-t-lg w-full" />
                <p className="text-white"><strong>Tenant Name:</strong> {property.tenantName}</p>
                <p className="text-white"><strong>Tenant Contact:</strong> {property.tenantPhoneNumber}</p>
                <p className="text-white"><strong>Location:</strong> {property.location}</p>
                <p className="text-white"><strong>Price:</strong> ₹{property.price}</p>
                <p className="text-white"><strong>Start Date:</strong> {new Date(property.startDate).toLocaleDateString()}</p>
                <p className="text-white"><strong>End Date:</strong> {new Date(property.endDate).toLocaleDateString()}</p>
                <p className="text-white"><strong>Total Rent:</strong> ₹{property.totalRent}</p>
                <p className="text-white"><strong>Rent Paid:</strong> ₹{property.rentPaid}</p>
              </Link>
            ))}
          </div>


          {/* Rent Due Popup */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white px-6 pb-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-80 overflow-y-auto relative">
                <div className="sticky top-0 bg-white z-10 py-4">
                  <div className="flex flex-row justify-between items-center mb-4 pb-2 border-b">
                    <h2 className="text-3xl font-bold">Properties with Rent Due</h2>
                    <button
                      onClick={closePopup}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
                {rentDueProperties.length > 0 ? (
                  <div className='flex flex-wrap flex-row justify-between px-4'>
                    {rentDueProperties.map((property) => (
                      <div key={property._id} className="mb-4">
                        <h3 className="text-2xl mb-1 font-bold text-red-500">{property.propertyName}</h3>
                        <hr className='border-t-red-600 mb-3' />
                        <p><strong>Tenant Name:</strong> {property.tenantName}</p>
                        <p><strong>Tenant Contact:</strong> {property.tenantPhoneNumber}</p>
                        <p><strong>Rent Due:</strong> ₹{property.totalRent - property.rentPaid}</p>
                        <p><strong>Days Remaining:</strong> {calculateDaysRemaining(property.endDate)} days</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No rent due.</p>
                )}
              </div>
            </div>
          )}

          {/* Near-Due Popup */}
          {showNearDuePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white px-6 pb-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-80 overflow-y-auto relative">
                <div className="sticky top-0 bg-white z-10 py-4">
                  <div className="flex flex-row justify-between items-center mb-4 pb-2 border-b">
                    <h2 className="text-3xl font-bold">Properties Near Due</h2>
                    <button
                      onClick={closeNearDuePopup}
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
                {nearDueProperties.length > 0 ? (
                  <div className='flex flex-wrap flex-row justify-between px-4'>
                    {nearDueProperties.map((property) => (
                      <div key={property._id} className="mb-4">
                        <h3 className="text-2xl mb-1 font-bold text-orange-500">{property.propertyName}</h3>
                        <hr className='border-t-orange-600 mb-3' />
                        <p><strong>Tenant Name:</strong> {property.tenantName}</p>
                        <p><strong>Tenant Contact:</strong> {property.tenantPhoneNumber}</p>
                        <p><strong>Rent Due:</strong> ₹{property.totalRent - property.rentPaid}</p>
                        <p><strong>Days Remaining:</strong> {calculateDaysRemaining(property.endDate)} days</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No properties are near due.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}












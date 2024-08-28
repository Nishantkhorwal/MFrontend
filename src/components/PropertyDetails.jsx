import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PropertyDetail() {
  const { id } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null);
  const [latestRentDueProperties, setLatestRentDueProperties] = useState([]);
  const [nearEndDateProperties, setNearEndDateProperties] = useState([]);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property detail:', error);
      }
    };
    const fetchLatestRentDueProperties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/latest-rent-due');
        const data = await response.json();
        setLatestRentDueProperties(data);
      } catch (error) {
        console.error('Failed to fetch latest properties with rent due:', error);
      }
    };
    const fetchNearEndDateProperties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/near-end-date');
        if (!response.ok) {
          throw new Error('Failed to fetch near end date properties');
        }
        const data = await response.json();
        console.log('Fetched Near End Date Properties:', data); // Debugging line
        setNearEndDateProperties(data);
      } catch (error) {
        console.error('Failed to fetch near end date properties:', error);
      }
    };
    


    fetchPropertyDetail();
    fetchLatestRentDueProperties();
    fetchNearEndDateProperties();
  }, [id]);

  if (!property) {
    return <div className='text-center font-semibold text-4xl text-green-700 py-10'>Loading...</div>;
  }

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  return (
    <>
      <div className='px-10'>
      <div className=" mt-10 px-20 mb-20 shadow-2xl py-16 bg-gray-100 rounded-md">
        <h1 className="text-5xl text-red-600 font-bold mb-6">{property.propertyName}</h1>
        <div className="flex flex-row justify-between ">
          <img src={property.imageUrl} alt={property.propertyName} className="w-1/2 rounded-l-2xl h-[400px] me-10" />
          <div className="w-1/2">
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Tenant Name:</strong> {property.tenantName}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Tenant Contact:</strong> {property.tenantPhoneNumber}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Location:</strong> {property.location}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Price:</strong> ₹{property.price}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Start Date:</strong> {new Date(property.startDate).toLocaleDateString()}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">End Date:</strong> {new Date(property.endDate).toLocaleDateString()}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Total Rent:</strong> ₹{property.totalRent}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Rent Paid:</strong> ₹{property.rentPaid}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Rent Due:</strong> ₹{property.totalRent - property.rentPaid}</p>
            <p className="text-3xl mb-1"><strong className="text-green-600 me-2">Days Remaining:</strong> {calculateDaysRemaining(property.endDate)} days</p>
          </div>
        </div>
      </div>
      </div>

      {/* Latest Properties with Rent Due */}
      <div className="container mx-auto p-4">
        <h1 className="text-5xl font-bold mb-10 text-start">Latest Properties with Rent Due</h1>
        {latestRentDueProperties.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-8 w-full">
            {latestRentDueProperties.map((property) => (
              <div
              onClick={() => window.location.href = `/property/${property._id}`}
                // to={`/property/${property._id}`}
                key={property._id}
                className="w-[30%] bg-red-600 shadow-lg rounded-lg p-6 cursor-pointer"
              >
                <div>
                  <h3 className="text-3xl font-semibold mb-4">{property.propertyName}</h3>
                  <img src={property.imageUrl} alt={property.propertyName} className="h-[200px] mb-5 rounded-t-lg w-full" />
                  <p className="text-xl"><strong className="text-white me-2">Tenant: {property.tenantName}</strong></p>
                  <p className="text-xl"><strong className="text-white me-2">Location: {property.location}</strong></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xl text-center">No property with rent due.</p>
        )}
      </div>

      {/* Latest Properties with Near End Date */}
      <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold mb-10 text-start">Latest Properties with Near End Date</h1>
      {nearEndDateProperties.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-8 w-full">
          {nearEndDateProperties.map((property) => (
            <Link
            onClick={() => window.location.href = `/property/${property._id}`}
              key={property._id}
              className="w-[30%] bg-red-600 shadow-lg rounded-lg p-6"
            >
              <div>
                <h3 className="text-3xl font-semibold mb-4">{property.propertyName}</h3>
                <img src={property.imageUrl} alt={property.propertyName} className="h-[200px] mb-5 rounded-t-lg w-full" />
                <p className="text-xl"><strong className="text-white me-2">Tenant: {property.tenantName}</strong></p>
                <p className="text-xl"><strong className="text-white me-2">Location: {property.location}</strong></p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-xl">No properties with an end date within the next 5 days...</p>
      )}
    </div>
    </>
  );
}




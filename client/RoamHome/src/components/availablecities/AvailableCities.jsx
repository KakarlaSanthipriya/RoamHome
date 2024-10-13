import React, { useState, useEffect } from 'react';
import './AvailableCities.css';
import { useLocation } from 'react-router-dom';
import { MdCurrencyRupee } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function AvailableCities() {
  const [showModal, setShowModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [roomType, setRoomType] = useState('');
  const [hostelType, setHostelType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const { searchTerm } = location.state || { searchTerm: '' };

  function checkOutDetails(property){
    navigate('/about-hostel',{state:{property}})
  }

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('http://localhost:5000/hostelMgmt-Api/hostelMgmt');
        if (res.ok) {
          const data1 = await res.json();
          let data=data1.payload;
          const allProperties = data.flatMap((management) => 
            management.properties?.map(property => ({
              ...property,
              user: {
                id: management.id, 
                username: management.username 
              }
            })) || []);
          
          const filtered = allProperties.filter((property) => {
            const city = property.city?.toLowerCase();
            const state = property.state?.toLowerCase();
            const searchLower = searchTerm.toLowerCase();
            return city?.includes(searchLower) || state?.includes(searchLower);
          });

          setProperties(filtered);
          setFilteredProperties(filtered); 
        } else {
          console.error('Failed to fetch properties.');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }

    fetchProperties();
  }, [searchTerm]);



  useEffect(() => {
    const applyFilters = () => {
      const roomTypeMap = {
        'PrvtRoom': 1,
        '2BedRoom': 2,
        '4BedRoom': 4,
        'more': 5,
      };

      console.log(properties);

      const filtered = properties.filter(property => {
        const matchesRoomType = roomType
        ? property.roomTypes.filter(room => {
            if (roomType === 'more') {
              console.log(Number(room.occupancy))
              return Number(room.occupancy) > 4;
            }
            return room.occupancy == roomTypeMap[roomType];
          }).length > 0
        : true;
         
        const matchesHostelType = hostelType
          ? property.Hosteltype?.toLowerCase() === hostelType.toLowerCase()
          : true;

          console.log(matchesHostelType)

        
        const matchesPrice = (
          (!minPrice || property.roomTypes.filter(room => Number(room.monthlyRate) >= minPrice).length > 0) &&
          (!maxPrice || property.roomTypes.filter(room => Number(room.monthlyRate) <= maxPrice).length > 0)
        );

        
        return matchesRoomType && matchesHostelType && matchesPrice;
      });

      setFilteredProperties(filtered);
    };

    applyFilters();
  }, [hostelType, roomType, minPrice, maxPrice, properties]);
  {filteredProperties.length > 0 ? (
    filteredProperties.map((property, index) => {
      console.log("Filtered Properties:", filteredProperties); // Log all filtered properties
      console.log("Current Property:", property); // Log the current property being processed
      console.log("Property Photos:", property.photos); // Log the photos of the current property
      
      return null; // or return <></> to render nothing
    })
  ) : (
    console.log("NO properties") || <div>No properties available.</div> // Optional rendering of a message
  )}

  

  return (
    <div className="available-cities">
      <div className="filtering">
        <h2 className='mt-4 ms-3'>Hostels in {searchTerm}</h2>
        <button className='filter' onClick={() => setShowModal(true)}>
          <IoFilterSharp /> Filters
        </button>
      </div>
      
      {filteredProperties.length > 0 ? (
  filteredProperties.map((property, index) => (
    <div key={index} className="card hostel-card">
      <div className="card-content">
        {property.photos && property.photos.length > 0 ? (
          <div className="card-image">
            <img
              src={`http://localhost:5000/Images/${property.photos[0]}`}
              alt="Property" 
              onError={(e) => {
                console.error("Image failed to load:", e.target.src); // Log the failed image URL
                e.target.src = "https://thumbs.dreamstime.com/b/dormitory-bedroom-bunk-bed-computer-desk-chair-wardrobe-bookshelf-cartoon-modern-illustration-empty-college-316727441.jpg"; // Fallback image
              }}
              onLoad={() => {
                console.log("Image loaded successfully:",` http://localhost:5000/Images/${encodeURIComponent(property.photos[0].split('/').pop())}`); // Log successful load
              }}
            />
          </div>
        ) : (
          <div className="card-image">
            <img 
              src="https://thumbs.dreamstime.com/b/dormitory-bedroom-bunk-bed-computer-desk-chair-wardrobe-bookshelf-cartoon-modern-illustration-empty-college-316727441.jpg" 
              alt="No photos available" 
            />
          </div>
        )}


        
        <div className="card-details">
          <h3>{property.hostelName}</h3>
          <p>{property.hostelOverview}</p>
          <p className='text-secondary'> {property.address}, {property.city}, {property.state}, {property.pinCode}</p>
          <p className='text-secondary'>Contact: {property.primaryPhone}, {property.altPhone}</p>
          <div className='book'>
            <p>Book your rooms at reasonable price!</p>
          </div>
          <div className='room-container'>
            {property.roomTypes.map((room, roomIndex) => (
              <div key={roomIndex}>
                <p className='room-types'> <strong> {room.name} from  </strong><p> <MdCurrencyRupee />{room.monthlyRate}</p> </p>
              </div>
            ))}
          </div>
          <div className='btn-infer'>
            <p className='text-danger'>Want to know more about hostel? Then check it out by clicking the button below</p>
          </div>
          <div>
            <button className='btn btn-warning btn15' onClick={() => checkOutDetails(property)}>Check out more details!</button>
          </div>
        </div>
      </div>
    </div>
  ))
) : (
  <p>No hostels found for the selected location.</p>
)}



      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" aria-labelledby="filtersLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="filtersLabel">Filters</h3>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form className="sorts">
                  <div className="HostelFilter">
                    <label htmlFor="hostelfilter">Hostel Type</label>
                    <select id="hostelfilter" onChange={hostelFilter => setHostelType(hostelFilter.target.value)} value={hostelType}>
                      <option value="" disabled>Select</option>
                      <option value="girls">Girls</option>
                      <option value="boys">Boys</option>
                      <option value="both">Combined</option>
                    </select>
                  </div>
                  <div className="RoomFilter">
                    <label htmlFor="roomsfilter">Room Type</label>
                    <select id="roomsfilter" className='mr-2' onChange={roomsFilter => setRoomType(roomsFilter.target.value)} value={roomType}>
                      <option value="" disabled>Select</option>
                      <option value="PrvtRoom">Private Rooms</option>
                      <option value="2BedRoom">2-Bed Dorm</option>
                      <option value="4BedRoom">4-Bed Dorm</option>
                      <option value="more">More than 4</option>
                    </select>
                  </div>
                  <div className="PriceRange">
                    <label>Price Range
                      <input type="number" placeholder='Min Price' onChange={minrange => setMinPrice(minrange.target.value)} value={minPrice} />
                      <input type="number" placeholder='Max Price' onChange={maxrange => setMaxPrice(maxrange.target.value)} value={maxPrice} />
                    </label>
                  </div>
                </form>
              </div>
              <div className="modal-footer filter-btn">
                <button type="button" className="clear btn btn-secondary w-25" onClick={() => {
                  setHostelType('');
                  setRoomType('');
                  setMinPrice('');
                  setMaxPrice('');
                  setShowModal(false);
                }}>Clear</button>
                
                <button type="button" className="btn btn-primary apply w-25" onClick={() => setShowModal(false)}>Apply</button></div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailableCities;
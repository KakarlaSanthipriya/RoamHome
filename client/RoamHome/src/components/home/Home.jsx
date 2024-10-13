import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [value, setValue] = useState('');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  let navigate = useNavigate();

  const onChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    async function fetchProperties() {
      try {
        let res = await fetch('http://localhost:5000/hostelMgmt-Api/hostelMgmt');
        if (res.ok) {
          let data1 = await res.json();
          let data=data1.payload;
          const propertyList = data.flatMap((item) => item.properties || []);
          setProperties(propertyList);
          console.log(propertyList); 
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }

    fetchProperties();
  }, []);

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    console.log('Search term:', searchTerm);
  };

  function submit() {
    const searchTerm = value.toLowerCase();
    navigate('/available-cities', { state: { searchTerm } });
  }
  

  return (
    <div className="main">
      <div className="home">
        <div className="container mt-5 aboutHome">
          <div className="image">
            <div className="tag">
              <h4 className="tagline">Find Your Perfect Stay</h4>
              <p className="sub-tagline">Discover a place where convenience meets comfort, designed just for you.</p>
            </div>
          </div>
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Where do you want to stay..."
                className="search-input"
              />
              <button onClick={submit} className="search-button" >
                Let's go
              </button>
            </div>
            <div className="dropdown">
  {[...new Set(
    properties
      .filter((property) => {
        const searchTerm = value.toLowerCase();
        const city = property.city?.toLowerCase();
        return searchTerm && city?.startsWith(searchTerm) && city !== searchTerm;
      })
      .map((property) => property.city.toLowerCase()) 
  )]
    .map((uniqueCity, index) => {
      
      const originalCity = properties.find(
        (property) => property.city?.toLowerCase() === uniqueCity
      ).city;
      
      return (
        <div key={index} onClick={() => onSearch(originalCity)} className="dropdown-row ms-4 border-3">
          {originalCity}
        </div>
      );
    })}
</div>

          </div>
        </div>
        <div className="container">
          <div className="cards-container">
            <div className="card c1">
              <div className="bg1">
                <img
                  src="https://st2.depositphotos.com/8080374/12201/v/950/depositphotos_122019608-stock-illustration-isometric-hostel-room.jpg"
                  alt="Room"
                />
                <h4>
                  <span style={{ color: 'red' }}>Customize</span> your stay
                </h4>
                <p>Choose your preferred room-sharing setup for the perfect living experience.</p>
              </div>
            </div>
            <div className="card c2">
              <div className="bg2">
                <img
                  src="https://img.freepik.com/premium-vector/customer-reviews-review-rating-mobile-phone-feedback-vector-illustration-reading-customer-review-smart-phone-before-buying-products_589019-3262.jpg"
                  alt="Reviews"
                />
                <h4>
                  <span style={{ color: 'orange' }}>Book</span> with confidence
                </h4>
                <p>See real reviews and ratings before you choose your hostel.</p>
              </div>
            </div>
            <div className="card c3">
              <img
                src="https://www.itarian.com/images/ticket-booking-system-wordpress.png"
                alt="Reservation"
              />
              <h4>
                <span style={{ color: 'green' }}>Reserve</span> your spot with ease
              </h4>
              <p>Pre-book your perfect hostel room in just a few clicks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

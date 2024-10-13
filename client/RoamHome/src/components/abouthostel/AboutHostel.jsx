import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './AboutHostel.css';
import { FaLocationDot } from "react-icons/fa6";
import { IoMdContact } from "react-icons/io";
import { BiLogoGmail } from "react-icons/bi";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineBedroomChild } from "react-icons/md";
import { BsPersonStandingDress } from "react-icons/bs";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdOutlinePets } from "react-icons/md";
import { FaSmoking } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";
import { FaHotTub } from "react-icons/fa";
import { FaAmazonPay } from "react-icons/fa";
import { MdLocalLaundryService } from "react-icons/md";
import { MdFoodBank } from "react-icons/md";
import { userLoginContext } from '../../contexts/UserLoginContext';

function AboutHostel() {
  const { loginUser, userLoginStatus, err } = useContext(userLoginContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { property } = location.state || { property: {} };
  const [showModal, setShowModal] = useState(false);

  
  

  const name = property.hostelName?.toUpperCase();

  const handleCloseModal = () => {
    setShowModal(false);
    
  };

  const handleBookRoom=(roomTypes)=>{
    if(!userLoginStatus)
    {
        setShowModal(true)
        
    }
    else{
      navigate('/hostlerform', { state: {
        roomTypes: property.roomTypes,
        hostelName: property.hostelName,
        owner: property.user}
       });
    }
  }
  console.log("roomTypes to send",property.roomTypes);
  console.log("hostelName to send",property.hostelName);
  console.log("property.photos",property.photos)
  return (
    <div>
      <div className='aboutHostels'>
        <h1 className='mt-5 text-center'>{name}</h1>
        <div className='image-container'>
        {Array.isArray(property.photos) && property.photos.length>0 && property.photos.map((photo, index) => (
           <img
           key={index}
           src={`http://localhost:5000${photo}`}
           className='photo'
         />
          ))}

        </div>
        <div className='container'>
          <h3 className='text-warning mt-5'>Hostel Overview</h3>
          <p>{property.hostelOverview}</p>

          <h3 className='text-warning'>Detailed information about our hostel and rooms</h3>
          <div className='rooms-container'>
            <div className='card r1'>
              <h5 className='text-success'>Rooms availability</h5>
              {property.roomTypes?.map((room, roomIndex) => (
                <div className='ms-5 me-5 mt-3' key={roomIndex}>
                  <h4 className='text-success'>Room Type {roomIndex + 1}</h4>
                  <p><MdOutlineBedroomChild /> <strong>Room name/Title: </strong> {room.name}</p>
                  <p><strong>Description:</strong></p>
                  <p>{room.description}</p>
                  <p><strong>Available rooms: </strong> {room.available}</p>
                  <p><BsPersonStandingDress /> <strong>Maximum occupancy: </strong> {room.occupancy}</p>
                  <p><RiMoneyRupeeCircleFill /> <strong>Monthly rate: </strong> {room.monthlyRate}</p>
                </div>
              ))}
            </div>

            <h3 className='text-warning mt-4'>General Info</h3>
            <div className='gen-container'>
              <div className='card r2'>
                <p><MdOutlinePets /> <strong>Allow pets: </strong> {property.allowPets ? 'Yes' : 'No'}</p>
                <p><FaSmoking /> <strong>Smoking allowed: </strong> {property.smokingAllowed ? 'Yes' : 'No'}</p>
                <p><FaWifi /> <strong>WiFi availability: </strong> {property.wifiAvailable ? 'Yes' : 'No'}</p>
                <p><TbAirConditioning /> <strong>AC Type: </strong> {property.acType}</p>
                <p><FaHotTub /> <strong>Hot water available: </strong> {property.hotWaterAvailable ? 'Yes' : 'No'}</p>
                <p><MdLocalLaundryService /> <strong>Laundry: </strong> {property.laundary ? 'Yes' : 'No'}</p>
                {property.laundaryFee >= 1 && (
                  <p><RiMoneyRupeeCircleFill /> <strong>Laundry fee: </strong> {property.laundaryFee}</p>
                )}
                <p><MdFoodBank /> <strong>Mess types: </strong> {property.messtypes}</p>
                <p><RiMoneyRupeeCircleFill /> <strong>Mess fee: </strong> {property.messfee}</p>
                <p><FaAmazonPay /> <strong>Payment options: </strong> {property.paymentOptions}</p>
              </div>
              <div className='card r3'>
                <h4 className='text-success'>Cancellation Policy</h4>
                <p className='ms-4'>{property.cancellationPolicy}</p>
                <h4 className='text-success'>House rules</h4>
                <p className='ms-4'>{property.houseRules}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='btn21'>
        <button className='btn btn-warning text-center mt-5' onClick={() => handleBookRoom(property.roomTypes)}>Book your room</button>
      </div>

      <div className='contact-details text-center'>
        <h5 className='mt-5 mb-3'>Address and contact details</h5>
        <p className='ms-3'><FaLocationDot /> {property.address}, {property.city}, {property.pinCode}, {property.state}</p>
        <p className='ms-3'><IoMdContact /> {property.primaryPhone}, {property.altPhone}</p>
        <p className='ms-3'><BiLogoGmail /> {property.email}</p>
      </div>

      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
             <div className='text-end'>
                <button type="button" className="btn-close fs-6 mt-3 me-3" onClick={handleCloseModal}></button>
                </div>
              <div className="modal-body">
                <p className="modal-title text-center">Have you not created your account?</p>
                <p className='text-center'>Then create your account to book your room.</p>
                <Link to='/register' className='text-success link-underline link-underline-opacity-0'>
                  <p className='text-center'>Register</p>
                </Link>
                <p className='text-center'>Already had an account then login to your account</p>
                <Link to='/login' className='text-primary link-underline link-underline-opacity-0'>
                  <p className='text-center'>Login</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutHostel;
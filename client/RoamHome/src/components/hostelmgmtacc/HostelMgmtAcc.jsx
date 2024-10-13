import React, { useContext, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hostelLoginContext } from '../../contexts/hostelLoginContext';
import { PropertyContext } from '../../contexts/PropertyContext';
import './HostelMgmtAcc.css';
import { FaRegBuilding } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdContact } from "react-icons/io";
import { BiLogoGmail } from "react-icons/bi";
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

function HostelMgmtAcc() {
  const { currentHostelMgmt, mgmtLoginStatus, hostelAdmins, fetchUsers } = useContext(hostelLoginContext);
  const { fetchProperties} = useContext(PropertyContext);
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  
  const fetchAndUpdateProperties = useCallback(async () => {
    await fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    if (!mgmtLoginStatus) {
      navigate('/hostel-property');
    } else {
      fetchAndUpdateProperties();
    }
  }, [mgmtLoginStatus, navigate, fetchAndUpdateProperties]);

  fetchUsers();
  const user = Array.isArray(hostelAdmins) ? hostelAdmins.find(user => user.email === currentHostelMgmt.email) : null;
  const userProperties = (user && user.properties) ? user.properties : [];
  function submit(propertyName) {
    console.log(propertyName);
    navigate('/EditListings', { state: { propertyName } });
  }

  function handleDeleteProperty(hostel) {
    console.log('Opening modal for:', hostel);
    setPropertyToDelete(hostel);
    setShowModal(true);
  }
  const confirmDelete = async () => {
    console.log(currentHostelMgmt)
    console.log(propertyToDelete)
    try {
      // Replace this with your API endpoint and method for deletion
      await fetch(`http://localhost:5000/hostelMgmt-Api/hostelAdmins/${currentHostelMgmt.username}/properties/${propertyToDelete}`, {
        method: "DELETE"
      });

      // Remove the deleted property from the userProperties state
      console.log("Property deleted")
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };
  

  return (
    <div>
      <div className='HostelMgmtName'>
        {mgmtLoginStatus ? (
          <>
            <div className='listing-page'>
              <div className='heading'>
                <h1>Hello, {currentHostelMgmt.username}!</h1>
                <p className='fs-3'>This is where you can manage all your listings</p>
              </div>
              <div className='container'>
                <div className='listings mt-5'>
                  <div className='p1'>
                    <img
                      src="https://img.freepik.com/free-vector/boy-thinking-with-question-mark-callouts_1308-109631.jpg?semt=ais_hybrid"
                      alt="Thinking"
                    />
                    <h5 className='text-center'>
                      Ready to connect with <span style={{ color: "orangered" }}> "Students and Professionals" </span> seeking accommodation? Why not showcase your hostel?
                    </h5>
                  </div>
                  <div className='p2'>
                    <img
                      src="https://us.123rf.com/450wm/yusakp/yusakp1702/yusakp170200039/72414674-vector-stock-of-a-businessman-holding-magnifier-glass-and-found-a-golden-opportunity-door.jpg?ver=6"
                      alt="Opportunity"
                    />
                    <h5 className='text-center'>
                      Unlock new opportunities by <span style={{ color: "gold" }}>"Listing your Property"</span> and connecting with those seeking the perfect accommodation.
                    </h5>
                  </div>
                  <div className='p3'>
                    <img
                      src="https://media.istockphoto.com/id/1133992590/vector/click-bar-and-finger-vector-web-button-icon-template.jpg?s=612x612&w=0&k=20&c=sD_v5Y4cWgHxXKYg9xdFPK_GBq6xWzGvH2yIlOCECOc="
                      alt="Click"
                    />
                    <h5>
                      Then go ahead and click the <span style={{ color: "green" }}>"Button"</span> below to list your property on our platform.
                    </h5>
                  </div>
                  <button onClick={() => navigate('/property1')} className='btn4 btn mb-4 btn-warning'>Add my properties</button>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='mt-5'>
                {userProperties.length > 0 ? (
                  <div className='listing-items'>
                    <div className='topHeader'>
                      <h2 className='myProperties text-danger'><span className='text-warning'>M</span>Y <span className='text-warning'>P</span>ROPERTIES</h2>
                    </div>
                    {userProperties.map((listing, index) => (
                      <div key={index} className='listing'>
                        <div className='btn8 d-flex w-25'>
                          <button className="p-2 text-center me-2" onClick={() => submit(listing.hostelName)}><strong>Edit my listings</strong></button>
                          <button className="p-2 text-center btn-danger" onClick={() => handleDeleteProperty(listing.hostelName)}><strong>Delete Property</strong></button>
                          {/* Modal for Delete Confirmation */}
      
                        </div>
                        <div className='container'>
                          <div className='cards-container2 mb-5'>
                            <div className='card card1'>
                              <div className="header1">
                                <img src="https://assets.isu.pub/document-structure/230112053806-eb963463ff97c90a44e6df6158f2800d/v1/cd9425f46f055da6875ac9d5a62af446.jpeg"/>
                                <h3>General Hostel Information</h3>
                              </div>
                              <div className='card-body text-start'>
                                <p><FaRegBuilding /> <strong>Property name: </strong>{listing.hostelName}</p>
                                <p><FaLocationDot /> <strong>Address: </strong> {listing.address}, {listing.city}, {listing.state}, {listing.pinCode}</p>
                                <p><IoMdContact /> <strong>Contact: </strong>{listing.primaryPhone}, {listing.altPhone}</p>
                                <p><BiLogoGmail /> <strong>Email: </strong> {listing.email}</p>
                                <p><strong>Hostel type: </strong>{listing.Hosteltype}</p>
                              </div>
                            </div>
                            <div className='card card2'>
                              <div className="header1">
                                <img src="https://media.istockphoto.com/vectors/university-students-boys-living-in-dorm-room-vector-id675683970?k=6&m=675683970&s=612x612&w=0&h=L9bo7h1rM4B4-Fc5QtfqjbK_1JKSfTFyOTse-o2OLYY="/>
                                <h3>Room Categories</h3>
                              </div>
                              <div className='card-body text-start'>
                              {listing && Array.isArray(listing.roomTypes) && listing.roomTypes.length > 0 ? (
                                   listing.roomTypes.map((room, roomIndex) => (
                                     <div key={roomIndex}>
                                       <p><MdOutlineBedroomChild /> <strong>Room name/Title: </strong> {room.name}</p>
                                       <p><strong>Available rooms: </strong> {room.available}</p>
                                       <p><BsPersonStandingDress /> <strong>Maximum occupancy: </strong> {room.occupancy}</p>
                                       <p><RiMoneyRupeeCircleFill /> <strong>Monthly rate: </strong> {room.monthlyRate}</p>
                                     </div>
                                       ))
                               ) : (
                                    <p>No room types available.</p>
)}
                              </div> 
                            </div>
                            <div className='card card3'>
                              <div className="header1">
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/430241744.jpg?k=7c47ae5f03fd71e57393b3e9cc8ecb9108f0a0370a2b68e1f962a9b7e230d4ab&o=&hp=1"/>
                                <h3>Basic details</h3>
                              </div>
                              <div className='card-body text-start'>
                                <p><MdOutlinePets /> <strong>Allows pets: </strong> {listing.allowsPets ? 'Yes' : 'No'}</p>
                                <p><FaSmoking /> <strong>Smoking policy: </strong> {listing.smokingPolicy}</p>
                                <p><FaWifi /> <strong>Wi-Fi availability: </strong> {listing.wifiAvailability ? 'Yes' : 'No'}</p>
                                <p><TbAirConditioning /> <strong>AC Type: </strong> {listing.acType}</p>
                                <p><FaHotTub /> <strong>Hot water availability: </strong> {listing.hotWaterAvailability ? 'Yes' : 'No'}</p>
                                <p><FaAmazonPay /> <strong>Payment options: </strong> {listing.paymentOptions}</p>
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <h2 className='text-danger text-center'>Your listings are empty!</h2>
                )}
              </div>
            </div>
          </>
        ) : (
          <h2 className='text-danger'>Unauthorized access</h2>
        )}
      </div>
      {showModal && (
  <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000}}>
    <div className="modal-content" style={{ background: '#fff', padding: '20px', margin: '100px auto', width: '300px' }}>
      <h4>Are you sure you want to delete this property?</h4>
      <div className="modal-buttons d-flex mt-3 ">
        <button onClick={confirmDelete} className='me-4 p-2 ms-5 bg-danger text-white border-0'>Delete</button>
        <button onClick={() => setShowModal(false)} className='p-2 text-white bg-success border-0'>Cancel</button>
      </div>
    </div>
  </div>
)}

      
    </div>
  );
}

export default HostelMgmtAcc;
import React, { useState, useEffect, useContext } from 'react';
import './UserProfile.css';
import { useForm } from 'react-hook-form';
import { userLoginContext } from '../../contexts/UserLoginContext';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { BsList } from "react-icons/bs";

function UserProfile() {
    const [isMobile, setIsMobile]=useState(window.innerWidth <= 768);
    const [showMoreModal, setShowMoreModal]=useState(false);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { register, handleSubmit, setValue } = useForm();
    const { currentUser, setCurrentUser } = useContext(userLoginContext);
    const [view, setView] = useState("profile");

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (currentUser) {
            setValue('username', currentUser.username);
            setValue('password',currentUser.password)
            setValue('email', currentUser.email);
            setValue('mobile', currentUser.mobile);
        }
    }, [currentUser, setValue]);

    const toggleModal = () => setShowMoreModal(!showMoreModal);
    const toggleEdit = () => setView("edit");
    const toggleProfileEdit = () => setView("profile");
    const toggleViewHostels = () => setView("hostels");
async function onSave(modifiedUser) {
    let res=await fetch(`http://localhost:5000/hostler-api/hostler-update/${currentUser._id}`,{
        method:"PUT",
        headers:{"content-type":"application/json",
                "Authorization":`Bearer ${sessionStorage.getItem('token')}`
        },
        body:JSON.stringify(modifiedUser)
    })
    let data=await res.json();
    if(data.message==='User modified')
    {
        modifiedUser._id=currentUser._id
        setCurrentUser(modifiedUser)
        setView('profile')
    }
}


    const fetchBookingDetails = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/hostler-api/hostlers/${currentUser.username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch hostels');
            console.log(response)
            const data1 = await response.json();
            
            const data = data1.payload 
    
            if (data && data.hostelBookingDetails) {
                setBookingDetails(data.hostelBookingDetails);
            } else {
                console.error('Booking details not found');
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleViewApplication = (booking) => {
        if (booking) {
            setSelectedBooking(booking);
            setShowModal(true);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedBooking(null);
    };

    useEffect(() => {
        if (currentUser) {
            fetchBookingDetails();
        }
    }, [currentUser]);

    return (
        <div className='page-container'>
            
            <div className='main-container'>
                <div className='sidebar'>
                    <div className='side-name'>
                    <p className='fs-3 ms-3'><strong>{currentUser.username}</strong></p></div>
                    <Link to='/' className="view text-black fs-5 link-underline link-underline-opacity-0">
                        <FaHome className='home-icon ms-5 me-1' /> <strong className='side'>Home</strong>
                    </Link>
                    <div className='viewp'>
                        
                        <button className="btn5_1 fs-5" onClick={toggleProfileEdit}><CgProfile className='ms-5 me-1' /><strong className='side'>Profile</strong></button>
                    </div>
                    <div className='viewe '>
                        
                        <button className="btn5_1 fs-5" onClick={toggleEdit}><MdEdit className='ms-5 me-1'/><strong className='side'>Edit Profile</strong></button>
                    </div>
                    <div className='viewh '>
                        
                        <button className="btn5_1 fs-5" onClick={toggleViewHostels}><GrView className='ms-5 me-1'/><strong className='side'>View Hostels</strong></button>
                    </div>
                </div>
                {isMobile && (
            <>
            <div className='more-button text-end me-4 fs-5'>
            <Link to='/' className="view text-black fs-5 link-underline link-underline-opacity-0">
                        <FaHome className='home-icon ms-5 me-4' /> <strong className='side'></strong>
                    </Link>
                <button  onClick={toggleModal} >
                <BsList />
                </button>
                
                </div>
                </>
            )}
            {showMoreModal && isMobile && (
                <div className="modal show profile-modal" style={{ display: 'block'}}>
                    <div className="modal-dialog md-1">
                        <div className="modal-content">
                        <div className="modal-header ">
                               
                                <button type="button" className="btn-close fs-6" onClick={toggleModal}></button>
                            </div>
                            <div className="modal-body">
                                
                                <button className="btn6_1 fs-6" onClick={() => { toggleProfileEdit(); toggleModal(); }}>
                                    <CgProfile className='me-1' /> Profile
                                </button>
                                <button className="btn6_1 fs-6" onClick={() => { toggleEdit(); toggleModal(); }}>
                                    <MdEdit className='me-1' /> Edit Profile
                                </button>
                                <button className="btn6_1 fs-6" onClick={() => { toggleViewHostels(); toggleModal(); }}>
                                    <GrView className='me-1' /> View Hostels
                                </button>
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
            )}

                <div className='content'>
                    
                    <div className='userprof'>
                        {view === "edit" ? (
                    <>
                    <div className='update-profile'>
              <form className='update-form p-3 mb-5' onSubmit={handleSubmit(onSave)}>
                
                
                  <p className='fs-1 ms-0'><img className='update-prof-img me-2 mb-2 mt-3' src="https://icon-library.com/images/status-update-icon/status-update-icon-1.jpg" alt="" /> Update your profile!</p>
                  <div className="mb-3 mt-5">
                      <label htmlFor="username" className='form-label'>Username</label>
                      <input type="text" id='username' className='form-control' {...register("username", { required: true, minLength: 4 })} />
                  </div>
                  <div className="mb-3">
                      <label htmlFor="password" className='form-label'>Password</label>
                      <input type="password" id='password' className='form-control' {...register("password", { required: true })} disabled />
                  </div>
                  <div className="mb-3">
                      <label htmlFor="email" className='form-label'>Email</label>
                      <input type="email" id='email' className='form-control' {...register("email", { required: true })} />
                  </div>
                  <div className="mb-3">
                      <label htmlFor="mobile" className='form-label'>Mobile Number</label>
                                    <input type="number" id='mobile' className='form-control' {...register("mobile", { required: true, minLength: 10, maxLength: 10 })} />
                                </div>
                                <div className='btn6 text-center'>
                                <button className="btn btn-success"  type="submit">Update</button></div>
                            </form>
                            </div>
                            </>
                        ) : view === "hostels" ? (
                            <div className='view-hostels'>
                                <div className='booking-tags'>
                                <h2>Hostels You’ve Reserved</h2>
                                <p>Here’s a list of the hostel rooms you’ve reserved.</p></div>
                                <div className='booking-details card '>
                                {bookingDetails.map((booking, index) => (
                                    <div key={index}>
                         <p><strong >Hostel name: </strong>{booking.hostelName}</p>
                         <p><strong>Room type booked: </strong>{booking.roomType}</p>
                         <p><strong>Stay: </strong>{booking.stay}</p>
                         <div className='btnv'>
                         <button onClick={() => handleViewApplication(booking)} className='p-2 border-0'>View Application</button>
                         </div>
                                    </div>
                                ))}
                                </div>
            {showModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                   <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Booking Details</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                          </div>
                     <div className="modal-body">
                       {showModal && selectedBooking && (
                          <div>
                          <p><strong>Full Name:</strong> {selectedBooking.fullName}</p>
                          <p><strong>Email:</strong> {selectedBooking.email}</p>
                          <p><strong>Primary Phone:</strong> {selectedBooking.primaryPhone}</p>
                          <p><strong>DOB:</strong> {selectedBooking.dob}</p>
                          <p><strong>Gender:</strong> {selectedBooking.gender}</p>
                          <p><strong>Profile:</strong> {selectedBooking.prof}</p>
                          <p><strong>Hostel Name:</strong> {selectedBooking.hostelName}</p>
                          <p><strong>Room Type:</strong> {selectedBooking.roomType}</p>
                          <p><strong>Address:</strong> {selectedBooking.address}</p>
                          <p><strong>Guardian Name:</strong> {selectedBooking.guardianName}</p>
                          <p><strong>Guardian Phone:</strong> {selectedBooking.guardianPhone}</p>
                          <p><strong>Stay:</strong> {selectedBooking.stay}</p>
                          <p><strong>Alternate Phone:</strong> {selectedBooking.altPhone}</p>
                            </div>
                   )}
               </div>
               <div className="modal-footer">
                   <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
               </div>
              </div>
       </div>
                </div>
            )}
          </div>
     ) : (
         <div className='profile-view'>
             <div className='profile-circle'>
        <span>{currentUser.username.charAt(0).toUpperCase()}</span>
    </div>
    <div className='profile-info'>
             
             <p className='fs-3'><strong>{currentUser.username}</strong> </p>
             <div className='email-mobile '>
             <MdEmail className='mb-2' /> <strong className='fs-5'>Email:</strong> <p className='Email'>{currentUser.email}</p>
             <FaMobileAlt className='mb-2' /> <strong className='fs-5'>Mobile number:</strong> <p className='Mobile'>{currentUser.mobile}</p>
             </div>
             </div>
         </div>
     )}
        </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
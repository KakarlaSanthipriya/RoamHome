import React, { useState, useEffect, useContext } from 'react';
import { hostelLoginContext } from '../../contexts/hostelLoginContext';
import './HostelBookings.css';

function HostelBookings() {
  const [bookingDetails, setBookingDetails] = useState([]); // Initialize as an empty array
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { currentHostelMgmt, hostelAdmins } = useContext(hostelLoginContext);
  const currentHostelMgmtEmail = currentHostelMgmt ? currentHostelMgmt.email : null;

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/hostelMgmt-Api/hostelAdmins/${currentHostelMgmt.username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch hostels');
      }
      const data = await response.json();
    
      const user = hostelAdmins.find(user => user.email === currentHostelMgmtEmail);
      if (user) {
        const bookingDetails = user.hostelBookingDetails || []; // Default to an empty array if undefined
        setBookingDetails(bookingDetails);
      } else {
        console.error('Hostel not found');
        setBookingDetails([]); // Reset to empty array if user is not found
      }
    } catch (error) {
      console.error(error);
      setBookingDetails([]); // Reset to empty array on error
    }
  };
  
  const handleViewApplication = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  return (
    <div>
      <h1 className='text-center mt-4'>Hostel Booking Details</h1>

      {/* Check if there are no bookings */}
      {bookingDetails && bookingDetails.length === 0 ? (
        <p className="text-center mt-4">No bookings found.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Applicant Name</th>
              <th>Contact Details</th>
              <th>Hostel Name</th>
              <th>Application Form</th>
            </tr>
          </thead>
          <tbody>
            {bookingDetails.map((booking, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{booking.fullName}</td>
                <td>{booking.primaryPhone} , {booking.altPhone}</td>
                <td>{booking.hostelName}</td>
                <td>
                  <div className='btn30 text-center'>
                    <button onClick={() => handleViewApplication(booking)} className='btn20 p-2'>View Application</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                {selectedBooking && (
                  <div>
                    <p><strong>Full Name:</strong> {selectedBooking.fullName}</p>
                    <p><strong>Email:</strong> {selectedBooking.email}</p>
                    <p><strong>Primary Phone:</strong> {selectedBooking.primaryPhone}</p>
                    <p><strong>Alternate Phone:</strong> {selectedBooking.altPhone}</p>
                    <p><strong>DOB:</strong> {selectedBooking.dob}</p>
                    <p><strong>Gender:</strong> {selectedBooking.gender}</p>
                    <p><strong>Profile:</strong> {selectedBooking.prof}</p>
                    <p><strong>Hostel Name:</strong> {selectedBooking.hostelName}</p>
                    <p><strong>Room Type:</strong> {selectedBooking.roomType}</p>
                    <p><strong>Address:</strong> {selectedBooking.address}</p>
                    <p><strong>Guardian Name:</strong> {selectedBooking.guardianName}</p>
                    <p><strong>Guardian Phone:</strong> {selectedBooking.guardianPhone}</p>
                    <p><strong>Stay:</strong> {selectedBooking.stay}</p>
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
  );
}

export default HostelBookings;

import React from 'react';
import './HostlerForm.css';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { userLoginContext } from '../../contexts/UserLoginContext';

function HostlerForm() {
  const { currentUser } = useContext(userLoginContext);
  const location = useLocation();
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
  const { roomTypes, hostelName, owner } = location.state || {};
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      primaryPhone: "",
      altPhone: "",
      dob: "",
      gender: "",
      prof: "",
      hostelName: "",
      roomType: ""
    }
  });

  useEffect(() => {
    if (hostelName) {
      setValue("hostelName", hostelName);
    }
  }, [hostelName, setValue]);

  const [err, setErr] = useState("");

  const onSubmit = async (data) => {
    try {
      console.log("Form submitted with data:", data);
      
      const token = sessionStorage.getItem('token');
  
      let res = await fetch(`http://localhost:5000/hostler-api/hostlers/${currentUser.username}/booking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
  
      // Check if the response is ok
      if (!res.ok) {
        const errorData = await res.json(); // Assuming the server returns error messages in JSON
        throw new Error(errorData.message || 'Failed to update hostler with hostelBookingDetails');
      }
  
      // Adding details to hostelMgmt Database
      res = await fetch(`http://localhost:5000/hostelMgmt-Api/hostelAdmins/${owner.username}/reservation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
  
      // Check if the response is ok
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update owner with hostelBookingDetails');
      }
  
      setShowModal(true);
  
    } catch (error) {
      setErr(error.message);
    }
  };
  

  return (
    <div className='hostelForm d-flex justify-content-center align-items-center'>
  <div className='col-9 col-sm-8 col-md-8 col-lg-8'>
    <form className='hform mb-5  mt-2 p-5 border mt-5' onSubmit={handleSubmit(onSubmit)}> 
      <h3 className='text-center'>Application Form </h3>
      
      <div className="mb-2">
        <label htmlFor="fullName" className='form-label'>Full Name</label>
        <input type="text" id='fullName' className='form-control' {...register("fullName", { required: true, minLength: 4 })} />
        {errors.fullName?.type === 'required' && <p className='text-danger lead'>*Username is required</p>}
        {errors.fullName?.type === 'minLength' && <p className='text-danger lead'>*Min Length should be 4</p>}
      </div>
      
      <div className="mb-2">
        <label htmlFor="email" className='form-label'>Email</label>
        <input type="email" id='email' className='form-control' {...register("email", { required: true })} />
        {errors.email?.type === 'required' && <p className='text-danger lead'>*Email is required</p>}
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="primaryPhone" className="form-label">Primary Phone Number</label>
          <input 
            type="text" 
            id="primaryPhone" 
            className="form-control" 
            {...register("primaryPhone", { required: true })} 
            placeholder="Primary Phone Number" 
          />
          {errors.primaryPhone && <p className="text-danger">*Primary phone number is required</p>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="altPhone" className="form-label">Alternative Phone Number</label>
          <input 
            type="text" 
            id="altPhone" 
            className="form-control" 
            {...register("altPhone")} 
            placeholder="Alternative Phone Number" 
          />
        </div>
      </div>

      <div className="mb-2">
        <label htmlFor="dob" className="form-label">Date of Birth</label>
        <input 
          type="date" 
          id="dob" 
          className="form-control" 
          {...register("dob", { required: true })} 
        />
        {errors.dob && <p className="text-danger">*This field is required</p>}
      </div>
      
      <div className="mb-2">  
        <label htmlFor="gender" className='form-label'>Gender</label>
        <select id='gender' className='form-control' {...register("gender", { required: true })}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className='text-danger lead'>*This field is required</p>}
      </div>

      
      <div className="mb-2"> 
  <label htmlFor="address" className='form-label'>Address</label>
  <textarea 
    id="address" 
    className='form-control' 
    {...register("address", { required: true })} 
    placeholder="Enter your address"
    rows="3" 
  />

  {errors.address && <p className='text-danger lead'>*Address is required</p>}
</div>

<div className="mb-2">
        <label htmlFor="guardianName" className='form-label'>Parent/Guardian Name</label>
        <input 
          type="text" 
          id="guardianName" 
          className='form-control' 
          {...register("guardianName", { required: true })} 
          placeholder="Enter Parent/Guardian Name"
        />
        {errors.guardianName && <p className='text-danger lead'>*Parent/Guardian name is required</p>}
      </div>

      
      <div className="mb-2">
        <label htmlFor="guardianPhone" className='form-label'>Parent/Guardian Phone Number</label>
        <input 
          type="text" 
          id="guardianPhone" 
          className='form-control' 
          {...register("guardianPhone", { required: true })} 
          placeholder="Enter Parent/Guardian Phone Number"
        />
        {errors.guardianPhone && <p className='text-danger lead'>*Parent/Guardian phone number is required</p>}
      </div>

      <div className="mb-2">  
        <label htmlFor="prof" className='form-label'>Profession</label>
        <select id='prof' className='form-control' {...register("prof", { required: true })}>
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Employee">Employee</option>
        </select>
        {errors.prof && <p className='text-danger lead'>*This field is required</p>}
      </div>

      <div className="mb-2">
        <label htmlFor="hostelName" className='form-label'>Hostel Name</label>
        <input type="text" id='hostelName' className='form-control' {...register("hostelName", { required: true}) } />
        {errors.hostelName?.type === 'required' && <p className='text-danger lead'>*Adhar is required</p>}
      </div>

      <div className="mb-2">
  <label htmlFor="roomtype" className='form-label'>Available Room Types</label>
  
  <select id='roomtype' className='form-control' {...register("roomType", { required: true })}>
  <option value="">Select</option>
  {roomTypes.length > 0 ? (
    roomTypes.map((room, index) => (
      <option key={index} value={room.name}>
        {room.name}
      </option>
    ))
  ) : (
    <option disabled>No rooms available at the moment.</option>
  )}
</select>


</div>

      
      <div className="mb-2">  
        <label htmlFor="stay" className='form-label'>Minimum no. of days you stay <span className='fst-italic text-muted'>(e.g., 1 month)</span></label>
        <input type="text" id="stay" className='form-control' {...register("stay", { required: true })} />
        {errors.stay && <p className='text-danger lead'>*This field is required</p>}
        <p className='mt-2 fw-bold text-danger'>Note: Later you can extend your stay</p>
      </div>

      <div className='text-center d-flex justify-content-center'>
        <button className="btn btn-warning" type="submit" ><span style={{color:"black"}  }>Submit Your Form</span></button>
      </div>

      

    </form> 
    {showModal && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <h4 className="modal-title text-center ">Your Application is submitted successfully</h4>
                  <p className='text-center text-danger'>NOTE: This application is valid for only 7 days </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HostlerForm;
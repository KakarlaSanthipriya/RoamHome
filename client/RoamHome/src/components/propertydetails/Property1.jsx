import React, { useState, useContext, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Property1.css';
import { PropertyContext } from '../../contexts/PropertyContext';

function Property1() {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      roomTypes: [{ name: "", description: "", available: 0, occupancy: 0, monthlyRate: 0 }],
      facilities: [],
    }
  });
  const { fields: roomFields, append, remove } = useFieldArray({ control, name: "roomTypes" });
  const { fields: facilityFields, append: appendFacility } = useFieldArray({ control, name: "facilities" });
  const [bedCount, setBedCount] = useState(1);
  const [roomTypeCount, setRoomTypeCount] = useState(1);
  const { addProperty } = useContext(PropertyContext);
  const [roomPhotos, setRoomPhotos] = useState([]);
  const { setProperty1Data } = useContext(PropertyContext);
  const [previewPhotos, setPreviewPhotos] = useState([])

  let navigate = useNavigate();

  const handleFormSubmit = (data) => {
    if (setProperty1Data) {
      setProperty1Data({
        hostelName: data.hostelName,
        address: data.address,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        primaryPhone: data.primaryPhone,
        altPhone: data.altPhone,
        email: data.email,
        Hosteltype: data.Hosteltype,
        hostelOverview: data.hostelOverview,
        roomTypes: data.roomTypes,
        facilities: data.facilities,
        photos: roomPhotos // Store raw file objects here
      });
      console.log("Form Data: ", { ...data, photos: roomPhotos }); // Log the data including the photos
      navigate('/property2');
    } else {
      console.error("setProperty1Data is not available");
    }
  };

  useEffect(() => {
    // console.log("setProperty1Data:", setProperty1Data); 
  }, [setProperty1Data]);

  const handleBedCountChange = (e) => {
    const value = parseInt(e.target.value);
    setBedCount(value);
  };

  const handleRoomTypeCountChange = (e) => {
    const value = parseInt(e.target.value);
    setRoomTypeCount(value);
    if (value > roomFields.length) {
      for (let i = roomFields.length; i < value; i++) {
        append({ type: "", name: "", description: "", available: 0, occupancy: 0, monthlyRate: 0 });
      }
    } else {
      for (let i = roomFields.length; i > value; i--) {
        remove(i - 1);
      }
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("files")
    setRoomPhotos(files); // Store files directly in roomPhotos state
console.log("room",roomPhotos)
    // Generate preview URLs for each selected file
    const photoPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewPhotos(photoPreviews);
  };
  console.log("preview",previewPhotos)

  
  return (
    <div className='property1 d-flex justify-content-center align-items-center'>
      <div className='col-9 col-sm-8 col-md-8 col-lg-8'>
        <form className='prop1 p-5 border rounded mt-5' onSubmit={handleSubmit(handleFormSubmit)}>
          {/* General Hostel Information */}
          <h4>General Hostel Information</h4>
          <div className="mb-3">
            <label htmlFor="hostelName" className='form-label'>Hostel Name</label>
            <input type="text" id='hostelName' className='form-control' {...register("hostelName", { required: true })} />
            {errors.hostelName && <p className='text-danger'>*Hostel Name is required</p>}
          </div>

          {/* Address Fields */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input 
              type="text" 
              id="address" 
              className="form-control" 
              {...register("address", { required: true })} 
              placeholder="Street Address" 
            />
            {errors.address && <p className="text-danger">*Address is required</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <input 
              type="text" 
              id="city" 
              className="form-control" 
              {...register("city", { required: true })} 
              placeholder="City" 
            />
            {errors.city && <p className="text-danger">*City is required</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="state" className="form-label">State</label>
            <input 
              type="text" 
              id="state" 
              className="form-control" 
              {...register("state", { required: true })} 
              placeholder="State" 
            />
            {errors.state && <p className="text-danger">*State is required</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="pinCode" className="form-label">Pin Code</label>
            <input 
              type="text" 
              id="pinCode" 
              className="form-control" 
              {...register("pinCode", { required: true })} 
              placeholder="Pin Code" 
            />
            {errors.pinCode && <p className="text-danger">*Pin Code is required</p>}
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

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              {...register("email", { required: true })} 
              placeholder="Email Address" 
            />
            {errors.email && <p className="text-danger">*Email is required</p>}
          </div>

          <div className="mb-2">
            <label htmlFor="Hosteltype" className='form-label'>Hostel Type?</label>
            <select id='Hosteltype' className='form-control' {...register("Hosteltype", { required: true })}>
              <option>Select</option>
              <option>Girls</option>
              <option>Boys</option>
              <option>Both</option>
            </select>
            {errors.Hosteltype?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="hostelOverview" className='form-label'>Hostel Overview</label>
            <textarea id='hostelOverview' className='form-control' {...register("hostelOverview", { required: true })} />
            {errors.hostelOverview && <p className='text-danger'>*Hostel Overview is required</p>}
          </div>

          {/* Room Categories */}
          <h4>Room Categories</h4>
          <div className="mb-3">
            <label htmlFor="roomTypeCount" className='form-label'>Number of Room Types</label>
            <input 
              type="number" 
              id='roomTypeCount' 
              className='form-control' 
              value={roomTypeCount}
              onChange={handleRoomTypeCountChange}
              min="1" 
              max="10" 
            />
          </div>

          {roomFields.map((item, index) => (
            <div key={item.id} className="mb-3">
              <label htmlFor={`roomTypes.${index}.name`} className='form-label'>Room Name/Title</label>
              <input
                type="text"
                id={`roomTypes.${index}.name`}
                className='form-control'
                {...register(`roomTypes.${index}.name`, { required: true })}
              />
              {errors.roomTypes?.[index]?.name && <p className='text-danger'>*Room Name/Title is required</p>}

              <label htmlFor={`roomTypes.${index}.description`} className='form-label'>Room Description</label>
              <textarea
                id={`roomTypes.${index}.description`}
                className='form-control'
                {...register(`roomTypes.${index}.description`, { required: true })}
              />
              {errors.roomTypes?.[index]?.description && <p className='text-danger'>*Room Description is required</p>}

              <label htmlFor={`roomTypes.${index}.available`} className='form-label'>Number of Rooms Available</label>
              <input
                type="number"
                id={`roomTypes.${index}.available`}
                className='form-control'
                {...register(`roomTypes.${index}.available`, { required: true })}
              />
              {errors.roomTypes?.[index]?.available && <p className='text-danger'>*Number of Rooms Available is required</p>}

              <label htmlFor={`roomTypes.${index}.occupancy`} className='form-label'>Max Occupancy</label>
              <input
                type="number"
                id={`roomTypes.${index}.occupancy`}
                className='form-control mb-2'
                {...register(`roomTypes.${index}.occupancy`, { required: true })}
              />
              {errors.roomTypes?.[index]?.occupancy && <p className='text-danger'>*Max Occupancy is required</p>}

              <div>
                <h5>Fee Details</h5>
                <div className='d-flex mb-2'>
                  <label htmlFor={`roomTypes.${index}.monthlyRate`} className='form-label w-25'>Monthly rate</label>
                  <input
                    type="number"
                    id={`roomTypes.${index}.monthlyRate`}
                    className='form-control'
                    {...register(`roomTypes.${index}.monthlyRate`)}
                  />
                </div>
                
              </div>
            </div>
          ))}

          <div className="mb-3">
            <label htmlFor="roomPhotos" className='form-label'>Upload Photos</label>
            <input
              type="file"
              id='roomPhotos'
              className='form-control'
              multiple
              onChange={handlePhotoChange}
            />
          </div>

          {/* Display thumbnails of uploaded images */}
          {roomPhotos.length > 0 && (
            <div className="mt-3">
              <h5>Uploaded Photos:</h5>
              <div className="d-flex flex-wrap">
                {roomPhotos.map((photo, index) => (
                  <div key={index} className="me-3">
                    {/* <img
                      src={photo}
                      alt={`Uploaded preview ${index}`}
                      width="100"
                      height="100"
                      style={{ objectFit: 'cover' }}
                    /> */}
                  </div>
                ))}
                <div className="image-preview-container d-flex ">
        {previewPhotos.map((photo, index) => (
          <div key={index} className="image-preview">
            <img className='me-3' src={photo} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
              </div>
            </div>
          )}

          <div className='text-end px-2 justify-content-end'>
            <button className="btn btn-info" type="submit" style={{ color: "black", width: "100px" }}>
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Property1;
import React from 'react'
import { useForm } from 'react-hook-form'
import './Property2.css'
import { useContext } from 'react';
import { PropertyContext } from '../../contexts/PropertyContext'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Property2() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { property1Data, addProperty } = useContext(PropertyContext); 
  const [showModal, setShowModal] = useState(false); 
  let navigate=useNavigate();
  const handleFormSubmit = (data) => {
    addProperty(property1Data, {
      allowPets: data.allowPets,
      smokingAllowed: data.smokingAllowed,
      wifiAvailable: data.wifiAvailable,
      acType: data.acType,
      hotWaterAvailable: data.hotWaterAvailable,
      laundary:data.laundary,
      laundaryfee:data.laundaryfee,
      messtypes:data.messtypes,
      messfee:data.messfee,
      cancellationPolicy: data.cancellationPolicy,
      houseRules: data.houseRules,
      paymentOptions: data.paymentOptions
    });
    setShowModal(true);


    console.log("Form Data: ", data);
    
   
      
    
  };
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/mgmt-account'); 
  };

  
  return (
    <div className="property2">
    <div className='container d-flex '>
      <div className='col-9 col-sm-8 col-md-8 col-lg-7'>
      <form className='pform mb-5 mt-4  mt-2 p-5 border rounded' onSubmit={handleSubmit(handleFormSubmit)}> 
      <h3 className='text-center mb-4'>Basic Details</h3>

        <div className="mb-2">
          <label htmlFor="allowPets" className='form-label'>Do you allow pets?</label>
          <select id='allowPets' className='form-control' {...register("allowPets", { required: true })}>
            <option value="" className='text-secondary'>Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.allowPets?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
        </div>

        <div className="mb-2">
          <label htmlFor="smokingAllowed" className='form-label'>Is smoking allowed?</label>
          <select id='smokingAllowed' className='form-control' {...register("smokingAllowed", { required: true })}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.smokingAllowed?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
        </div>

        <div className="mb-2">
          <label htmlFor="wifiAvailable" className='form-label'>Is Wi-Fi available?</label>
          <select id='wifiAvailable' className='form-control' {...register("wifiAvailable", { required: true })}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.wifiAvailable?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
        </div>

        <div className="mb-2">
          <label htmlFor="acType" className='form-label'>AC/Non-AC/Both</label>
          <select id='acType' className='form-control' {...register("acType", { required: true })}>
            <option value="">Select</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
            <option value="Both">Both</option>
          </select>
          {errors.acType?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
        </div>
        
        <div className="mb-2">  
          <label htmlFor="hotWaterAvailable" className='form-label'>Hotwater available or not?</label>
          <select id='hotWaterAvailable' className='form-control' {...register("hotWaterAvailable", { required: true })}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.hotWaterAvailable?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
        </div>

        <div className="mb-2">  
          <label htmlFor="laundary" className='form-label'>Is laundary available or not (Washing Machine)?</label>
          <select id='laundary' className='form-control' {...register("laundary", { required: true })}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.laundary?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
        </div>
        
        <div className="mb-2">
                <label htmlFor="laundaryfee" className='form-label'>Fee of Laundary if is present/month</label>
                <input type="number" id='laundaryfee' className='form-control' {...register("laundaryfee")} />
              </div>
              
              <div className="mb-2">  
          <label htmlFor="messtypes" className='form-label'>What is available in Mess?</label>
          <select id='messtypes' className='form-control' {...register("messtypes", { required: true })}>
            <option>Select</option>
            <option>VEG</option>
            <option>NON-VEG</option>
            <option>Both</option>
          </select>
          {errors.messtypes?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
        </div>

              <div className="mb-2">
                <label htmlFor="messfee" className='form-label'>MessFee/month</label>
                <input type="number" id='messfee' className='form-control' {...register("messfee", { required: true })} />
                {errors.messfee?.type === 'required' && <p className='text-danger lead'>*this field is required</p>}
              </div>

        {/* Policies */}
        <h4>Policies</h4>
          <div className="mb-3">
            <label htmlFor="cancellationPolicy" className='form-label'>Cancellation Policy</label>
            <textarea
              id='cancellationPolicy'
              className='form-control'
              {...register("cancellationPolicy")}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="houseRules" className='form-label'>House Rules</label>
            <textarea
              id='houseRules'
              className='form-control'
              {...register("houseRules")}
            />
          </div>

          <div className="mb-3">
          <label htmlFor="paymentOptions" className='form-label'>Payment</label>
          <select id='paymentOptions' className='form-control' {...register("paymentOptions", { required: true })}>
            <option>Select</option>
            <option>Cash</option>
            <option>CreditCard</option>
            <option>Online</option>
            <option>Other</option>
          </select>
          {errors.laundary?.type === 'required' && <p className='text-danger lead'>*This field is required</p>}
          </div>
          <div className='text-center b1'>
          <button className="btn btn-info" type="submit"><span style={{color:"black",width:"25px"}}>Submit</span></button>
        </div>
      </form>
      </div>
    </div>
    {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p>Your property has been listed successfully!</p>
              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Property2;
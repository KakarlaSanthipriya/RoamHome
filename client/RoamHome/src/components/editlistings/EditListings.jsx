import React, { useEffect, useContext } from 'react';
import { hostelLoginContext } from '../../contexts/hostelLoginContext';
import { PropertyContext } from '../../contexts/PropertyContext';
import { useForm, useFieldArray, set } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './EditListings.css'
import { useLocation } from 'react-router-dom';

function EditListings() {
    const { currentHostelMgmt, hostelAdmins,setHostelAdmins } = useContext(hostelLoginContext);
    const { fetchProperties, setProperties ,properties} = useContext(PropertyContext); 
    const { register, handleSubmit, setValue, control, reset } = useForm({
        defaultValues: {
            roomTypes: []
        }
    });
    const location = useLocation();
  const { propertyName } = location.state;
    console.log("prop id:",propertyName)

    const { fields, append, remove } = useFieldArray({ control, name: 'roomTypes' });
    let navigate=useNavigate();

    useEffect(() => {
      async function loadUserData() {
          const adminsArray = Array.isArray(hostelAdmins) ? hostelAdmins : [hostelAdmins];
  
          const user = adminsArray.find(u => u._id === currentHostelMgmt._id);
          if (user && user.properties) {
              const property = user.properties.find(prop => prop.hostelName === propertyName);
              if (property) { // Check if the property exists
                  setValue('hostelName', property.hostelName);
                  setValue('address', property.address);
                  setValue('city', property.city);
                  setValue('state', property.state);
                  setValue('pinCode', property.pinCode);
                  setValue('primaryPhone', property.primaryPhone);
                  setValue('altPhone', property.altPhone);
                  setValue('email', property.email);
                  setValue('Hosteltype', property.Hosteltype);
                  setValue('hostelOverview', property.hostelOverview);
                  setValue('allowPets', property.allowPets);
                  setValue('smokingAllowed', property.smokingAllowed);
                  setValue('wifiAvailable', property.wifiAvailable);
                  setValue('acType', property.acType);
                  setValue('hotWaterAvailable', property.hotWaterAvailable);
                  setValue('laundary', property.laundary);
                  setValue('laundaryfee', property.laundaryfee);
                  setValue('messfee', property.messfee);
                  setValue('cancellationPolicy', property.cancellationPolicy);
                  setValue('houseRules', property.houseRules);
                  setValue('paymentOptions', property.paymentOptions);
  
                  if (property.roomTypes) {
                      reset({ roomTypes: property.roomTypes });
                  }
              } else {
                  console.error("Property not found for hostel name:", propertyName);
              }
          } else {
              console.error("User or properties not found for ID:", currentHostelMgmt.id);
          }
      }
  
      if (currentHostelMgmt) {
          loadUserData();
      }
  }, [currentHostelMgmt, hostelAdmins, setValue, reset]);
  
    async function onSubmit(modifiedHostelAdmin) {
      if (!currentHostelMgmt || !currentHostelMgmt._id) {
          console.error("Current user ID is not defined.");
          return; // Early return or handle this case appropriately
      }
  
      let res = await fetch(`http://localhost:5000/hostelMgmt-Api/hostelAdmins/${currentHostelMgmt._id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionStorage.getItem('token')}`
          },
          body: JSON.stringify(modifiedHostelAdmin)
      });
  
      let data = await res.json();
      console.log(data.message)
      if (data.message === 'Property updated successfully') {
          modifiedHostelAdmin._id = currentHostelMgmt._id
          console.log("mod",modifiedHostelAdmin)
          console.log("curr",currentHostelMgmt)
          
          navigate("/mgmt-account")
      } else {
          console.error("Failed to update:", data);
      }
  }
  

  
  //   async function onSubmit(modifiedData){
  //     let res=await fetch(`http://localhost:5000/hostelMgmt-Api/property-update/${currentHostelMgmt._id}`,{
  //       method:"PUT",
  //       headers:{"content-type":"application/json",
  //         "Authorization":`Bearer ${sessionStorage.getItem('token')}`
  // },
  // body:JSON.stringify(modifiedData)

  //     })
  //     let data=await res.json();
  //     if(data.message==='Property modified')
  //     {
  //       modifiedData._id=currentHostelMgmt._id
  //       setHostelAdmins(modifiedData);
  //       navigate('/mgmt-account')
  //     }
    
    
    
    
    

    return (
        <div className='edit-listings'>
            <div className='show-grid'>
                <h1 className='text-center mt-4'>Edit Details</h1>
                <form className='eform form' onSubmit={handleSubmit(onSubmit)}>
                    {/* Form fields */}
                    
                    <div className='cd1'>
                    <h2 className='text-center'>General Information</h2>
                    <div className='form-group'>
                        <label htmlFor='hostelName'>Property Name</label>
                        <input type='text' id='hostelName' {...register('hostelName', { required: true })} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='address'>Address</label>
                        <input type='text' id='address' {...register('address', { required: true })} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='city'>City</label>
                        <input type='text' id='city' {...register('city', { required: true })} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='state'>State</label>
                        <input type='text' id='state' {...register('state', { required: true })} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='pinCode'>Pin Code</label>
                        <input type='text' id='pinCode' {...register('pinCode', { required: true })} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='primaryPhone'>Primary Phone</label>
                        <input type='text' id='primaryPhone' {...register('primaryPhone', { required: true })} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='altPhone'>Alternate Phone</label>
                        <input type='text' id='altPhone' {...register('altPhone')} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' {...register('email', { required: true })} />
                    </div>
                    <div className="mb-2">
          <label htmlFor="Hosteltype" className='form-label'>Hostel Type?</label>
          <select id='Hosteltype' className='form-control' {...register("Hosteltype", { required: true })}>
            <option>Select</option>
            <option>Girls</option>
            <option>Boys</option>
            <option>Both</option>
          </select>
        </div>
                    <div className='form-group'>
                        <label htmlFor='hostelOverview'>Hostel Overview</label>
                        <textarea id='hostelOverview' className='w-100' {...register('hostelOverview')} />
                    </div>
                    </div> 
                    {/* Room Types Section */}
                    <div className='cd2'>
                    
                    <div className='room-types'>
                   
                        <h3 className='text-center'>Room Types</h3>
                        
                        {fields.map((room, index) => (
                            <div key={room.id} className='room-type'>
                                <div className='form-group'>
                                    <label htmlFor={`roomTypes[${index}].name`}>Room Name</label>
                                    <input
                                        type='text'
                                        id={`roomTypes[${index}].name`}
                                        {...register(`roomTypes[${index}].name`, { required: true })}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor={`roomTypes[${index}].description`}>Description</label>
                                    <input
                                        type='text'
                                        id={`roomTypes[${index}]`.description}
                                        {...register(`roomTypes[${index}].description`, { required: true })}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor={`roomTypes[${index}].available`}>Available</label>
                                    <input
                                        type='number'
                                        id={`roomTypes[${index}]`.available}
                                        {...register(`roomTypes[${index}].available`, { required: true })}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor={`roomTypes[${index}].occupancy`}>Occupancy</label>
                                    <input
                                        type='number'
                                        id={`roomTypes[${index}]`.occupancy}
                                        {...register(`roomTypes[${index}].occupancy`, { required: true })}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor={`roomTypes[${index}].monthlyRate`}>Monthly Rate</label>
                                    <input
                                        type='number'
                                        id={`roomTypes[${index}].monthlyRate`}
                                        {...register(`roomTypes[${index}].monthlyRate`, { required: true })}
                                        
                                    />

                                </div>
                                
                                <div className='text-center mt-4 btnd'>
                                <button type='button' onClick={() => remove(index)} className='btn btn-danger'>Delete Room</button>
                                </div>
                            </div>
                        ))}
                        <div className='text-center btna'>
                         <button type='button' onClick={() => append({ name: '', description: '', available: '', occupancy: '', monthlyRate: '' })} className='btn btn-primary'>Add Room</button>
                         </div>
                    </div>
                    </div>
                    <div className='cd3'>
                    <div className="basic-details">
                        <h3 className='text-center'>Basic Details</h3>
                        <div className="mb-2">
          <label htmlFor="allowPets" className='form-label'>Do you allow pets?</label>
          <select id='allowPets' className='form-control' {...register("allowPets", { required: true })}>
            <option value="" className='text-secondary'>Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
        </div>

        <div className="mb-2">
          <label htmlFor="smokingAllowed" className='form-label'>Is smoking allowed?</label>
          <select id='smokingAllowed' className='form-control' {...register("smokingAllowed", { required: true })}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
         
        </div>

        <div className="mb-2">
          <label htmlFor="wifiAvailable" className='form-label'>Is Wi-Fi available?</label>
          <select id='wifiAvailable' className='form-control' {...register("wifiAvailable", { required: true })}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
         
        </div>

        <div className="mb-2">
          <label htmlFor="acType" className='form-label'>AC/Non-AC/Both</label>
          <select id='acType' className='form-control' {...register("acType", { required: true })}>
            <option value="">Select</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
            <option value="Both">Both</option>
          </select>
          
        </div>
        
        <div className="mb-2">  
          <label htmlFor="hotWaterAvailable" className='form-label'>Hotwater available or not?</label>
          <select id='hotWaterAvailable' className='form-control' {...register("hotWaterAvailable", { required: true })}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
        </div>
        <div className="mb-2">  
          <label htmlFor="laundary" className='form-label'>Is laundary available or not (Washing Machine)?</label>
          <select id='laundary' className='form-control' {...register("laundary", { required: true })}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
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
          
        </div>
        <div className="mb-2">
                <label htmlFor="messfee" className='form-label'>MessFee/month</label>
                <input type="number" id='messfee' className='form-control' {...register("messfee", { required: true })} />
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
          
          </div>
          </div>
            
                    </div>
                    <div className='btnsave'>
                    <button type='submit' className=' border-0 bg-success p-2 rounded w-75'>Save Changes</button>
                    </div>
                    </form> 
            </div>
            </div>
        
    );
}

export default EditListings;
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './ListYourProperties.css' 
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';


function ListYourProperties() {

  let navigate =useNavigate();

  function submit(){
    navigate('/hostel-property')
  }

  return (
    <div className='prop'>
      <div className="container com align-items-center mt-5">
        
          <div className='info'>
          <h1 className="tag1">
            "Searching for <span style={{ color: 'orange' }}>hostel enthusiasts</span>? We've got you covered."
          </h1>
          <h6 className='ms-4 fs-3 fw-bold'>Attract students and working professionals by listing with us!</h6>
          <img className='arrow' src="https://static.vecteezy.com/system/resources/previews/008/501/569/original/dotted-hand-drawn-arrow-line-free-png.png" alt="" />
          <div className='btnl text-center'>
          <button  onClick={submit} className='btn fs-5' >List your properties<HiArrowRight /> </button></div>

          
        </div>
        <div className='img-1'>
          <img
            
            
            src="https://as2.ftcdn.net/v2/jpg/06/68/21/91/1000_F_668219199_9cA4fhoeXOWsYPyFwCE2YJHsEocZKf8y.jpg"  
            alt="Hostel"
          />
        </div>
      </div>
      </div>
  )
}

export default ListYourProperties
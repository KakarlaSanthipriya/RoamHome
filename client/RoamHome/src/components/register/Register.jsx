import React from 'react'
import './Register.css'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { TbBackground } from 'react-icons/tb'
import { useContext } from 'react'
import { hostelLoginContext } from '../../contexts/hostelLoginContext'

function Register() {
  let { register, handleSubmit, formState: { errors }, watch } = useForm()
  const {fetchUSers} = useContext(hostelLoginContext);
  let [err, setErr] = useState('')

 
  const password = watch('password')

  let navigate = useNavigate();

  async function handleFormSubmit(userObj) {
   
    let endpoint = userObj.usertype === 'Hostler' ? "hostler" : "hostelmanagement";
try{
    if(endpoint==='hostler'){
      console.log(endpoint)
      let res = await fetch(`http://localhost:5000/hostler-api/hostler`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(userObj),
      });
      let data=await res.json()
      if (data.message === 'user created') {
          navigate('/login')    
      }
      else{
        setErr('Username already existed');
      }
    }
    else if(endpoint==='hostelmanagement'){
      let res= await fetch('http://localhost:5000/hostelMgmt-Api/admin', {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(userObj)
      });
      let data=await res.json()
      if (data.message === 'user created') {
        navigate('/hostel-property')    
      }
      else{
         setErr('Username already existed');
      }
    
  }
}catch (error) {
  console.error("Error:", error);
  setErr('An error occurred while connecting to the server. Please try again later.');
}
  }



  return (
    <div className='register '>
      <div className='gridItems'>
        <div className="grid-item1">
          
            {err.length !== 0 && <p className='fs-4 text-danger text-center'>{err}</p>}
            
            <form className='rform mb-5 mx-auto mt-2 p-3' onSubmit={handleSubmit(handleFormSubmit)}> 
              <div>
                <h1 className='ms-5'><strong>Let's create your account</strong></h1>
                <p className='ms-5'><strong>Carefully fill up your details below</strong></p>
              </div>
              <div className="mb-2">
                
                <label htmlFor="username" className='form-label' ></label>
                <input type="text" id='username' className='form-control' {...register("username", { required: true, minLength: 4 })} placeholder='Username' />
                {errors.username?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*Username is required</p>}
                {errors.username?.type === 'minLength' && <p className='text-danger lead ms-5 ps-3'>*Min Length should be 4</p>}
                
              </div>
              <div className="mb-2">
                <label htmlFor="email" className='form-label'></label>
                <input type="email" id='email' className='form-control' {...register("email", { required: true })} placeholder='Email'/>
                {errors.email?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*Email is required</p>}
              </div>
              <div className="mb-2">
                <label htmlFor="password" className='form-label'></label>
                <input type="password" id='password' className='form-control' {...register("password", { required: true })} placeholder='Password' />
                {errors.password?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*Password is required</p>}
              </div>
              <div className="mb-2">
                <label htmlFor="confirmpassword" className='form-label'></label>
                <input type="password" id='confirmpassword' className='form-control' 
                  {...register("confirmpassword", { 
                    required: true,
                    validate: (value) => value === password || "Passwords do not match"
                  })}  placeholder='Confirm password'
                />
                {errors.confirmpassword && <p className='text-danger lead ms-5 ps-3'>{errors.confirmpassword.message}</p>}
              </div>
              <div className="mb-2">
                <label htmlFor="mobile" className='form-label'></label>
                <input type="text" id='mobile' className='form-control' {...register("mobile", { required: true, minLength: 10, maxLength: 10 })} placeholder='Mobile number' />
                {errors.mobile?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*Mobile Number is required</p>}
                {errors.mobile?.type === 'minLength' && <p className='text-danger lead ms-5 ps-3'>*Length should be 10</p>}
                {errors.mobile?.type === 'maxLength' && <p className='text-danger lead ms-5 ps-3'>*Length should be 10</p>}
              </div>
              <div className="mb-2">
                <label htmlFor="usertype" className='form-label ms-5' ></label>    
          <select id='usertype' className='form-control' {...register("usertype", { required: true })}>
            <option>Select usertype</option>
            <option>Hostler</option>
            <option>Hostel Management</option>
          </select>
          {errors.usertype?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*This field is required</p>}
              </div>

              <div className='text-center'>
                <button className="btn1" type="submit"><span style={{color:"black"}}>Create Account</span></button>
              </div>
            </form> 
          </div>
        
        <div className="grid-item2">
          
          <p className='title'>Join the <span>RoamHome</span> Community Today!</p>
          <img src="https://img.freepik.com/free-vector/cheap-inn-affordable-guesthouse-college-dormitory-motel-check-hostel-services-lower-priced-accommodation-best-hostel-facilities-concept_335657-694.jpg?t=st=1725115579~exp=1725119179~hmac=8e8f780501103f1def2f6605d20427df246cc482ea0841955b58034d42fcfc40&w=996" alt="" className="image1" />
          
          <p className='loginpage mb-5'>Already had an account? <Link to='/login' className='text-dark'>Login</Link> to your account</p>
        </div>
       
        </div>
      </div>
  )
}

export default Register
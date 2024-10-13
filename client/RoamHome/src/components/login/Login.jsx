import React from 'react'
import './Login.css'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'  
import { useNavigate } from 'react-router-dom'
import { userLoginContext } from '../../contexts/UserLoginContext'
import { useContext } from 'react'
import { useState, useEffect } from 'react'

function Login() {
  let {loginUser, userLoginStatus, err}=useContext(userLoginContext)
  let {register,handleSubmit,formState:{errors}}=useForm()
  const navigate=useNavigate()
  
  function onUserLogin(userCred)
  {
    //console.log(userCred)
    loginUser(userCred)
  }

  useEffect(()=>{
    if(userLoginStatus===true)
      {
        navigate('/')
      }
  },[userLoginStatus])

  return (

  <div className='loginPage'>
    <div className='container mt-5 login'>
     
        <div className='hostelimg'>
        <img src="https://png.pngtree.com/png-clipart/20230825/original/pngtree-hostel-rooms-hotel-room-illustration-picture-image_8646937.png" alt="" />
      </div>
      
     
      <div className='loginCard'>
      
       <p className='quote text-center mt-3 text-dark'><span style={{color:"Red"}}>Log in </span>to simplify your stay—where managing your hostel life is just a click away.</p>
       
        
         
          {
            err.length != 0 && <p className='text-danger mt-3 text-center'>{err}</p>
          }
          <form className='signin mx-auto mt-5 p-3 mb-5' onSubmit={handleSubmit(onUserLogin)}>
            <div className="mb-3">
              <label htmlFor="email" className='form-label'>Email</label>
              <input type="email" id='email' className='form-control' {...register("email", { required: true })} /> 
              {errors.email?.type === 'required' && <p className='text-danger lead'>*Email is required</p>} 
            </div>
            <div className="mb-3">
              <label htmlFor="password" className='form-label'>Password</label>
              <input type="password" id='password' className='form-control' {...register("password", { required: true })} /> 
              {errors.password?.type === 'required' && <p className='text-danger lead'>*Password is required</p>} 
            </div>
            <div className='text-center'>
              <button className="btn2 btn btn-success">Sign in</button>
              </div>
            <p className='text-center mt-3 text-secondary text-decoration-underline'>Forgot Password?</p>
            <p className='text-center'>Don't have an Account?</p>
          <Link to="/register" className="text-center nav-link text-success">Register</Link>
          </form>
          </div>
          </div>
          </div>
          
          
        
   

    
      
   
    
  )
}

export default Login
import React from 'react'
import './HostelProperty.css'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { hostelLoginContext } from '../../contexts/hostelLoginContext';
import { useContext } from 'react';
import { useEffect } from 'react';

function HostelProperty() {
  let {loginHostelMgmt, mgmtLoginStatus, err}=useContext(hostelLoginContext)
  let {register,handleSubmit,formState:{errors}}=useForm()
  const navigate=useNavigate()
  
  function onMgmtLogin(mgmtCred)
  {
    //console.log(userCred)
    loginHostelMgmt(mgmtCred)
  }

  useEffect(()=>{
    if(mgmtLoginStatus===true )
      {
        navigate('/mgmt-account')
      }
  },[mgmtLoginStatus])


  return (
    <div className="Hostellogin">
      <div className="container mt-5 propertylogin">
        <div className="hostel">
            <img src="https://cdn.vectorstock.com/i/500p/99/53/banner-for-hostel-with-big-word-and-tourists-flat-vector-36699953.jpg" alt="" />
        </div>

        <div className="loginCred">
          <p className="welcome text-center mt-5">
             Welcome to RoamHome
          </p>
          <p className="manageproperty text-center mt-3">
            Sign in to <span style={{color:"#DC143C"}}>manage your property</span>
          </p>
          {err.length !== 0 && <h2 className='text-danger mt-3 text-center'>{err}</h2>}
        
        <form action="" className="loginform mx-auto mt-5 p-3 mb-5 border" onSubmit={handleSubmit(onMgmtLogin)}>
          <div className="mb-3">
             <label htmlFor="email" className="form-label">Email</label>
             <input type="text" name="" id="email" className='form-control'
             {...register("email",{
              required: true
             })}/>
              {errors.email?.type === 'required' && <p className='text-danger lead'>*Email is required</p>} 
          </div>
          <div className="mb-3">
              <label htmlFor="password" className='form-label'>Password</label>
              <input type="password" id='password' className='form-control' {...register("password", { required: true })} /> 
              {errors.password?.type === 'required' && <p className='text-danger lead'>*Password is required</p>} 
            </div>
          <div className='text-center'> 
            <button className='btn3 btn-secondary btn'>Sign in</button>
          </div>
          <p className='text-center mt-3 text-secondary text-decoration-underline'>Forgot Password?</p>
          <p className='text-center'>Don't have an Account?</p>
          <Link to="/register" className="text-center nav-link link" ><span style={{
    color: "#E0AA3E",
    textShadow: "2px 2px 5px rgba(255, 195, 0, 0.7)"
}}>
  Create property Account
</span></Link>
        </form>
        </div>
      </div>
    </div>
  );
}

export default HostelProperty
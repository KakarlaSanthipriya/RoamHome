import React, { useContext, useEffect } from 'react';
import './Login2.css';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';  
import { userLoginContext } from '../../contexts/UserLoginContext';

function Login2() {
  const { loginUser, userLoginStatus, err } = useContext(userLoginContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the location where the user came from or default to home
  const from = location.state?.from?.pathname || '/about-hostel';

  function onUserLogin(userCred) {
    loginUser(userCred);  // Trigger the login process
  }

  // Redirect to the page where the user came from after login
  useEffect(() => {
    if (userLoginStatus === true) {
      navigate(from);  // Navigate to the stored location (e.g., AboutHostel)
    }
  }, [userLoginStatus, navigate, from]);

  return (
    <div className='loginPage'>
      <div className='container mt-5 login'>
        <div className='hostelimg'>
          <img src="https://png.pngtree.com/png-clipart/20230825/original/pngtree-hostel-rooms-hotel-room-illustration-picture-image_8646937.png" alt="" />
        </div>

        <div className='loginCard'>
          <p className='quote text-center mt-3'>
            <span style={{color:"Red"}}>Log in </span>to simplify your stay—where managing your hostel life is just a click away.
          </p>

          {/* Handle potential errors */}
          {err.length !== 0 && <p className='text-danger mt-3 text-center'>{err}</p>}
          
          <form className='signin mx-auto mt-5 p-3 mb-5 border' onSubmit={handleSubmit(onUserLogin)}>
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
  );
}

export default Login2;


// 169, 96, 103
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, Navigate } from "react-router-dom";
import { SiHomebridge } from "react-icons/si";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaUserPlus, FaRegUser, FaSignInAlt } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { CgMoreO } from "react-icons/cg";
import { userLoginContext } from '../../contexts/UserLoginContext'; 
import { hostelLoginContext } from '../../contexts/hostelLoginContext';
import { MdOutlinePlaylistAddCircle } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { FcAbout } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaEye } from "react-icons/fa";


import "./Header.css";

function Header() {
  const { currentUser, logoutUser, userLoginStatus } = useContext(userLoginContext);
  const { currentHostelMgmt, logoutHostelMgmt, mgmtLoginStatus } = useContext(hostelLoginContext);
  let navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); 
  const [loginMenuOpen, setLoginMenuOpen] = useState(false); 
  const menuRef = useRef(null);
  const loginMenuRef = useRef(null);

  const currentEndUser = (currentUser === null) ? currentHostelMgmt : currentUser;
  const logoutEndUser = (currentEndUser === currentUser) ? logoutUser : logoutHostelMgmt;
  const enduserLoginStatus = (currentEndUser === currentUser) ? userLoginStatus : mgmtLoginStatus;

  const showSidebar = () => {
    setIsOpen(prev => !prev);
  };
  const showLoginMenu = () => {
    setLoginMenuOpen(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
      setLoginMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserClick = () => {
    if (currentEndUser === currentUser) {
      navigate('/user-profile');
    }
  };

  const handleLogout = () => {
    logoutEndUser();
    navigate('/'); 
  };

  

  return (
    <div className='header'>
      <div className='d-flex flex-wrap header justify-content-between p-2 shadow-sm'>
        <div className='name-logo d-flex flex-wrap pt-1'>
          <SiHomebridge className='logo ' />
          <h1 className='name  '>
            <span><Link to='' className='nav-link' >RoamHome</Link></span>
          </h1>
        </div>

        <ul className="nav fs-5">
          <li className="nav-item ">
            <Link to="listyourproperties" className="nav-link text-black prop">
              <LiaClipboardListSolid className='mb-1 ms-5'/>List your property
            </Link>
          </li>
          <li className="nav-item ">
            <Link to="register" className="nav-link text-black regi">
              <FaUserPlus className='mb-1 me-1 ms-3'/>
              Register
            </Link>
          </li>
          {enduserLoginStatus === false ? (
            <li className="nav-item " ref={loginMenuRef}>
              <span className="nav-link text-black log" onClick={showLoginMenu}>
                <FiLogIn className='mb-1 ms-1' /> Login
              </span>
              {loginMenuOpen && (
                <div className='login-dropdown' ref={loginMenuRef}>
                  <ul className="login-menu fs-5" >
                    <li>
                      <Link to='/login' className='text-dark link-underline link-underline-opacity-0'>
                      <FaRegUserCircle/> Hostler Login
                      </Link>
                    </li>
                    <li>
                      <Link to='/hostel-property' className='text-dark link-underline link-underline-opacity-0'>
                      <FaBuildingUser /> Hostel Management Login
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ) : (
            <li className='nav-item mt-2'>
              <span className='name-drop text-black' onClick={showSidebar}>
              {currentEndUser.username}
              <IoMdArrowDropdown className='mb-1 mt-1' />
                 
              </span>
            </li>
            )}
          
       {/* {enduserLoginStatus &&(
          <li className="nav-item p-1 more" onClick={showSidebar}>
            <CgMoreO className='mb-1'/>
          </li>
          )} */}
        
     {currentEndUser===currentHostelMgmt && enduserLoginStatus ?(
      <div className='menu' ref={menuRef}>
        <ul className="fs-5 hamburger-menu" style={{ display: isOpen ? "grid" : "none" }}>
          <li>
            <Link to='mgmt-account' className='text-dark link-underline link-underline-opacity-0'>
              <MdOutlinePlaylistAddCircle /> Add my properties
            </Link>
          </li>
          <li>
            <Link to='hostel-bookings' className='text-dark link-underline link-underline-opacity-0'>
            <FaEye /> View Booked users
            </Link>
          </li>
        
          <li>
            <FcAbout /> About
          </li>
          {enduserLoginStatus && (
            <li onClick={handleLogout}>
              <TbLogout2 className='me-2' />
              Logout
            </li>
          )}
        </ul>
      </div>
      ) :(
        enduserLoginStatus &&(
        <div className='menu' ref={menuRef}>
        <ul className="fs-5 hamburger-menu" style={{ display: isOpen ? "grid" : "none" }}>
          <li>
            <Link to='/user-profile' className='text-dark link-underline link-underline-opacity-0'>
              <MdOutlinePlaylistAddCircle /> My profile
            </Link>
          </li>
          
          <li>
            <FcAbout /> About
          </li>
          {enduserLoginStatus && (
            <li onClick={handleLogout}>
              <TbLogout2 className='me-2' />
              Logout
            </li>
            
          )}
        </ul>
      </div>
        ) 
      )}
    </ul>
    </div>
    </div>

  );
}

export default Header;
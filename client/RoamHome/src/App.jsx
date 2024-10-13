import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutingError from './components/RoutingError';
import RootLayout from "./RootLayout";
import Home from './components/home/Home';
import Register from './components/register/Register';
import ListYourProperties from './components/listyourproperties/ListYourProperties';
import Login from './components/login/Login';
import UserProfile from './components/userprofile/UserProfile';
import HostelProperty from './components/hostelproperty/HostelProperty';
import HostelMgmtAcc from './components/hostelmgmtacc/HostelMgmtAcc' 
import Property1 from './components/propertydetails/Property1'
import Property2 from './components/propertydetails/Property2'
import EditListings from './components/editlistings/EditListings';
import AvailableCities from './components/availablecities/AvailableCities'
import AboutHostel from './components/abouthostel/AboutHostel';
import HostlerForm from './components/hostlerform/HostlerForm';
import HostelBookings from './components/hostelbookings/HostelBookings';
import Login2 from './components/login2/Login2';


function App() {
  const browserRouter =createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      errorElement: <RoutingError />,
      children: [
        {
          path:'',
          element:<Home />
         },
         {
           path:'login',
           element:<Login />
         },
         {
          path:'login2',
          element:<Login2 />
         },
         {
          path:'register',
          element:<Register />
        },
        //  {
        //    path:'more',
        //    element:<More />
        //  },
         {
          path:'listyourproperties',
          element:<ListYourProperties />
         },
         {
          path:'user-profile',
          element:<UserProfile />
         },
         {
          path:'hostel-property',
          element:<HostelProperty />
         },
         {
          path: 'mgmt-account',
          element: <HostelMgmtAcc />
         },
         {
          path:'property1',
          element: <Property1 />
         },
         {
          path:'property2',
          element:<Property2 />
         },
         {
          path:'EditListings',
          element:<EditListings />
         },
         {
          path:'available-cities',
          element:<AvailableCities />
         },
         {
          path:'about-hostel',
          element:<AboutHostel />
         },
         {
          path:'hostlerform',
        element:<HostlerForm />       
        },
        {
          path:'hostel-bookings',
          element:<HostelBookings />
        }


      ]
    }
  ])
  return (
    <div>
      <RouterProvider router={browserRouter} />
      
    </div>
  )
}

export default App
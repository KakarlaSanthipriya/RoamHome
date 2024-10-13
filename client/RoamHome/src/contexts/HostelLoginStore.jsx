import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { hostelLoginContext } from './hostelLoginContext';

function HostelLoginStore({children}) {

    const [currentHostelMgmt, setCurrentHostelMgmt] = useState(null);
    const [mgmtLoginStatus, setMgmtLoginStatus] = useState(false);
    const [err, setErr]= useState("");
    

    async function loginHostelMgmt(mgmtCred){
        try{
            let res = await fetch(
                'http://localhost:5000/hostelMgmt-Api/hostelMgmt-login',
                {
                    method: "POST",
                    headers: {"Content-type":"application/json"},
                    body: JSON.stringify(mgmtCred),
                }
            );
            let loginres = await res.json();
            // console.log("mgmtList: ",mgmtList);

            if(loginres.message === 'login success'){
                setCurrentHostelMgmt(loginres.admin);
                setMgmtLoginStatus(true);
                setErr("");
                sessionStorage.setItem('token',loginres.token)
            }
            else{
                setCurrentHostelMgmt({});
                setMgmtLoginStatus(false);
                setErr(loginres.message);
            }
        }
        catch(error){
            setErr(error.message);
        }
    }

    function logoutHostelMgmt(){
        setCurrentHostelMgmt({});
        setMgmtLoginStatus(false);
        setErr("");
        sessionStorage.removeItem('token')
    }

    const [hostelAdmins, setHostelAdmins] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


//     useEffect(() => {
//       const fetchUsers = async () => {
//           try {
//               const response = await fetch('http://localhost:3000/hostelmanagement');
//               if (!response.ok) {
//                   throw new Error('Failed to fetch users');
//               }
//               const data = await response.json();
//               setHostelAdmins(data);
//               setLoading(false);
//           } catch (error) {
//               setError(error.message);
//               setLoading(false);
//           }
//       };

//       fetchUsers(); // Initial fetch

//       const intervalId = setInterval(fetchUsers, 5000); // Poll every 5 seconds

//       return () => clearInterval(intervalId); // Cleanup interval on component unmount
//   }, []);
  
async function fetchUsers() {
    try {
        const token = sessionStorage.getItem('token'); 

        const res = await fetch(`http://localhost:5000/hostelMgmt-Api/hostelAdmins`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }

        const data1 = await res.json();

        const data = data1.payload || []; 

        setHostelAdmins(data); 
    } catch (error) {
        setError(error.message);
        console.error("Error fetching users:", error.message);
    }
}


    function updateHostelAdmins(updateFn) {
      setHostelAdmins((prevHostelAdmins) => {
          const updatedHostelAdmins = updateFn(prevHostelAdmins);
          return updatedHostelAdmins;
      });
  }

  return (
    <hostelLoginContext.Provider
       value={{loginHostelMgmt, logoutHostelMgmt , setCurrentHostelMgmt, currentHostelMgmt, err, mgmtLoginStatus, hostelAdmins, setHostelAdmins,updateHostelAdmins,fetchUsers}}
    >
        {children}
    </hostelLoginContext.Provider>
  )
}

export default HostelLoginStore
import React, { useState } from 'react';
import { PropertyContext } from './PropertyContext';
import { hostelLoginContext } from './hostelLoginContext';
import { useContext } from 'react';

function PropertyStore({ children }) {

  const { currentHostelMgmt, logoutHostelMgmt, mgmtLoginStatus ,setHostelAdmins, hostelAdmins,updateHostelAdmins} = useContext(hostelLoginContext);
  const currentHostelMgmtUsername = currentHostelMgmt ? currentHostelMgmt.username : null;
  const currentHostelMgmtEmail=currentHostelMgmt ? currentHostelMgmt.email : null;
  

  const [properties, setProperties] = useState([]);
  const [err, setErr] = useState('');
  const [property1Data, setProperty1Data] = useState({});

  // Function to fetch properties
  async function fetchProperties() {
    try {
        // Fetch the users data, including their properties
        let res = await fetch(`http://localhost:5000/hostelMgmt-Api/hostelAdmins/${currentHostelMgmt.username}`);
        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }
        let userList = await res.json();

        // Find the specific user with the current hostel management ID
        const user = userList.find(user => user.email === currentHostelMgmtEmail); // Assuming currentHostelMgmtEmail or similar is available

        if (user) {
            // Extract properties from the user
            const properties = user.properties || [];
            setProperties(properties);
            setErr('');
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        setErr(error.message);
    }
}


  // Function to add a property
  async function addProperty(property1Data, property2Data) {
    try {
        const formData = new FormData();

        // Append property1Data to formData
        for (const key in property1Data) {
            if (key === 'photos') {
                property1Data.photos.forEach((file) => {
                    formData.append('photos', file); // Append each photo as a file
                });
            } else if (key === 'roomTypes') {
                // Convert roomTypes to a JSON string
                formData.append('roomTypes', JSON.stringify(property1Data.roomTypes)); // Append as a JSON string
            } else {
                formData.append(key, property1Data[key]); // Append other fields
            }
        }

        // Append property2Data to formData
        for (const key in property2Data) {
            if (key === 'roomTypes') {
                // Convert roomTypes to a JSON string if it's also part of property2Data
                formData.append('roomTypes', JSON.stringify(property2Data.roomTypes)); // Append as a JSON string
            } else {
                formData.append(key, property2Data[key]); // Append fields from property2Data
            }
        }

        // Check the contents of formData before sending
        for (const [key, value] of formData.entries()) {
            console.log(key, value); // Log each key-value pair in FormData
        }

        const token = sessionStorage.getItem('token');

        let res = await fetch(`http://localhost:5000/hostelMgmt-Api/hostelAdmins/${currentHostelMgmt.username}/listing`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}` // Do not set Content-Type for FormData
            },
            body: formData // Use formData as body
        });

        let result = await res.json();
        if (result.message === 'Hostler not found') {
            throw new Error('Failed to update hostel management with new property');
        }

        setProperties([...properties, formData]);
        handleAddProperty(formData);
        setErr('');
    } catch (error) {
        setErr(error.message);
    }
}



  const handleAddProperty = (newProperty) => {
    updateHostelAdmins((hostelAdmins) => {
        return hostelAdmins.map(admin => {
            if (admin.email === currentHostelMgmt.email) {
                return {
                    ...admin,
                    properties: [...(admin.properties || []), newProperty]
                };
            }
            console.log("prop",properties)
            return admin;
        });
    });
};
    
  
  // Function to delete a property
  // async function deleteProperty(propertyId) {
  //   try {
  //     let res = await fetch(http://localhost:5000/hostelmanagement/${currentHostelMgmtId}/properties/${propertyId}, {
  //       method: 'DELETE',
  //     });

  //     if (!res.ok) {
  //       throw new Error('Failed to delete property');
  //     }

  //     setProperties(properties.filter(property => property.id !== propertyId));
  //     setErr('');
  //   } catch (error) {
  //     setErr(error.message);
  //   }
  // }

  return (
    <PropertyContext.Provider
      value={{
        properties,
        fetchProperties,
        addProperty,
        err,
        property1Data,
        setProperty1Data,
        setProperties,
        updateHostelAdmins
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export default PropertyStore;
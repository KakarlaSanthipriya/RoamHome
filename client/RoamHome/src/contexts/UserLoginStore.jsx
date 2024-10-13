import { userLoginContext } from "./UserLoginContext";
import { useState } from "react";

function UserLoginStore({ children }) {
  // login user state
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoginStatus, setUserLoginStatus] = useState(false);
  const [err, setErr] = useState("");

  // user login
  async function loginUser(userCred) {
    try {
      let res = await fetch(
        'http://localhost:5000/hostler-api/hostler-login',
        {
          method:"POST",
          headers:{"Content-type": "application/json"},
          body: JSON.stringify(userCred),
        }
      );
      let requestres = await res.json();

      if (requestres.message === 'login success') {
        
        setCurrentUser(requestres.hostler);
        setUserLoginStatus(true);
        setErr("");
        sessionStorage.setItem('token',requestres.token)
      } else {
        setCurrentUser({});
        setUserLoginStatus(false);
        setErr(requestres.message);
      }
    } catch (error) {
      setErr(error.message);
    }
  }

  // user logout
  function logoutUser() {
    // reset state
    setCurrentUser({});
    setUserLoginStatus(false);
    setErr("");
    sessionStorage.removeItem('token')
  }

  return (
    <userLoginContext.Provider
      value={{ loginUser, logoutUser, userLoginStatus, err, currentUser, setCurrentUser }}
    >
      {children}
    </userLoginContext.Provider>
  );
}

export default UserLoginStore;
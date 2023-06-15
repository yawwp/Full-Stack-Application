import { useContext, useEffect } from "react";
import { Navigate } from "react-router";
import UserContext from "../../context/UserContext";


/**
 * Sign Out
 * 
 * This page uses the Context API and the User Provider. 
 * The User Provider actions method sign out,
 * removes all user's information from the machine
 */
function UserSignout() {
  const { actions } = useContext(UserContext);
  useEffect(() => {
    actions.signOut();
    },[]);

  return (
    <Navigate to = '/' replace/>
  )
}

export default UserSignout
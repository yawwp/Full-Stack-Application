import { useContext, useEffect } from "react";
import { Navigate } from "react-router";
import UserContext from "../../context/UserContext";

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
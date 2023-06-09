import { useContext } from 'react';
import UserContext from "../../context/UserContext";
import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoute = () => {
    const { authUser } = useContext(UserContext);

    return authUser ? <Outlet/> : <Navigate to='/forbidden' />
}

export default PrivateRoute; 
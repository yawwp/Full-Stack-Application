import { useContext } from 'react';
import UserContext from "../../context/UserContext";
import { Navigate, Outlet } from 'react-router-dom';


/**
 * Private Route for App 
 * 
 * @returns If there is an auth user then outlet to the private componenets
 *          If not then navigate to the forbidden page.
 */
const PrivateRoute = () => {
    const { authUser } = useContext(UserContext);
    
    return authUser ? <Outlet/> : <Navigate to='/forbidden' />
}

export default PrivateRoute; 
import { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

const UserContext = createContext(null);

/**
 * User Provider
 * - Used to test for an authenticated user and provides user information 
 * through out the application
 *  
 * 
 * useStates
 * 1) authUser state uses a cookie to store the user's email address. This was set from 
 * the signIn method. 
 * 2) user state is used to get the password to re-authenticate to certain routes. 
 * 
 * useEffect
 * - Sets the localStorage user
 * 
 * Methods
 * SignIn 
 * - Takes in an email address and password. This method sets the cookie and 
 * updates the state
 * 
 * SignOut
 * - removes credentials from local storage, cookies and updates the user state
 */

export const UserProvider = (props) => {
    const cookie = Cookies.get("authenticatedUser");
    const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);
    const [user, setUser] = useState([]);

    useEffect(() => {
        const data = window.localStorage.getItem('user');
        if (data !== null) {
            setUser(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const signIn = async (creds) => {
        try {
            const info = {
                emailAddress: creds.emailAddress,
                password: creds.password
            }

            setUser(info);

            const encodedCredentials = btoa(`${info.emailAddress}:${info.password}`);
            const fetchOptions = {
                method: "GET",
                headers: {
                    Authorization: `Basic ${encodedCredentials}`
                }
            };

            const response = await fetch("http://localhost:5000/api/users", fetchOptions);
            if (response.status === 200) {
                const user = await response.json();
                setAuthUser(user);
                Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
                return user;
            } else if (response.status === 401) {
                return null;
            } else if (response.status === 500) {
                throw new Error('Internal Server Error');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const signOut = async () => {
        setAuthUser(null);
        Cookies.remove('authenticatedUser');
        localStorage.removeItem("user");
    }

    return (
        <UserContext.Provider value={{
            user,
            authUser,
            actions: {
                signIn,
                signOut
            }
        }}>
            {props.children}
        </UserContext.Provider>

    )
}

export default UserContext;
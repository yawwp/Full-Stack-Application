import { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

const UserContext = createContext(null);

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
            } else {
                throw new Error();
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
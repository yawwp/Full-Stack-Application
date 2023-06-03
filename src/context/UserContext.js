import { createContext, useState } from "react";
import Cookies from 'js-cookie';

const UserContext = createContext(null);

export const UserProvider = (props) => {
    const cookie = Cookies.get("authenticatedUser");
    const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);
    const [userCredentials, setUserCredentials] = useState({});

    const signIn = async (creds) => {
        try {
            const info = {
                emailAddress:creds.emailAddress,
                password:creds.password
            }

            setUserCredentials(info);

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
    }

    return (
        <UserContext.Provider value={{
            authUser,
            userCredentials,
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
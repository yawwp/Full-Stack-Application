import React, { useEffect } from 'react'
import { useContext, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';

/**
 * User Sign In Page - GET Request 
 * 
 * This page is for users to sign in. We use the useContext hook along 
 * with the User Context Provider to fetch for the user, based on 
 * the email address and password. 
 * 
 * The handle sumbit button is passed in the email address and password.
 * Then the data is passed the "http://localhost:5000/api/users" back-end 
 * to verify if the user is in the data base. 
 * 
 */
function UserSignIn() {
    const { signIn } = useContext(UserContext).actions;

    const navigate = useNavigate();
    const location = useLocation();

    const emailAddress = useRef(null);
    const password = useRef(null);
    const [errors, setErrors] = useState([]);



    const handleSubmit = async (event) => {
        event.preventDefault();
        const creds = {
            emailAddress: emailAddress.current.value,
            password: password.current.value
        };
        try {
            const user = await signIn(creds);
            if (user) {
                if (location.state === null) { 
                    navigate('/');
                } else { 
                    navigate(location?.state?.from?.pathname);
                }
            } else {
                throw new Error();
            }
        } catch (error) {
            //500 Error 
            if (error.message === 'Internal Server Error'){
                navigate('/error'); 
            } else {
            //Validation Error 
                setErrors(["Sign-in was unsuccessful"]);
            }
        } 
    }

    const handleCancel = async (event) => {
        event.preventDefault();
        navigate('/');
    }

    return (
        <div className="form--centered">
            <h2>Sign In</h2>
            {errors.length ? (
                <div>
                    <h2 className="validation--errors--label" > Validation errors</h2>
                    <div className="validation-errors" >
                        <ul>
                            {errors.map((error, i) => <li key={i}> {error} </li>)}
                        </ul>
                    </div>
                </div>
            ) : null}
            <form onSubmit={handleSubmit}>
                <label htmlFor="emailAddress">Email Address</label>
                <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress} />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" ref={password} />
                <button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={handleCancel} >Cancel</button>
            </form>
            <p>Don't have a user account? Click here to <Link to='/signup'>sign up</Link>!</p>
        </div>
    )
}

export default UserSignIn;
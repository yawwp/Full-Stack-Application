import React from 'react'
import { useContext, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';

function UserSignIn() {
    const { signIn } = useContext(UserContext).actions;
    
    const navigate = useNavigate();
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
                navigate('/');
            } else {
                throw new Error();
            }
        } catch (error) {
            setErrors(["Sign-in was unsuccessful"]);
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
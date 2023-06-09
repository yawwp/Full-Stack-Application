import React from 'react'
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react'

function UserSignUp() {
    const firstName = useRef(null);
    const lastName = useRef(null);
    const emailAddress = useRef(null);
    const password = useRef(null);

    const [errors, setErrors] = useState([]);

    const onSubmit = async (event) => {
        event.preventDefault();

        const user = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            emailAddress: emailAddress.current.value,
            password: password.current.value
        };

        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(user)
            });
            if (response.status === 201) {
                console.log(`${user.firstName} has been authenticated`);
                <Link to='/' />
            } else if (response.status === 400) {
                const data = await response.json();
                setErrors(data.errors);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log(error);
            <Link to='error' />
        }
    };

    function onCancel(event) {
        event.preventDefault();
        <Link to='/' />
    };

    return (
        <div className="form--centered">
            <h2>Sign Up</h2>
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
            <form onSubmit={onSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" type="text" ref={firstName} />
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" type="text" ref={lastName} />
                <label htmlFor="emailAddress">Email Address</label>
                <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress} />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" ref={password} />
                <button className="button" type="submit">Sign Up</button><button className="button button-secondary" onClick={onCancel} >Cancel</button>
            </form>
            <p>Already have a user account? Click here to <Link to='/signin'>sign in</Link>!</p>
        </div>
    )
}

export default UserSignUp
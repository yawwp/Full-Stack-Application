import React from 'react'
import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';

function CreateCourse() {
    const navigate = useNavigate();
    const { authUser, setUserCredentials } = useContext(UserContext);
    const { firstName, lastName } = authUser;

    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);
    const [errors, setErrors] = useState([]);

    console.log(setUserCredentials);
    const onSubmit = async (event) => {
        event.preventDefault();

        // Format estimated time
        const estimatedTimeValue = estimatedTime.current.value.trim();
        const formattedEstimatedTime = estimatedTimeValue.match(/^\d+/)?.[0] || '';
        const formattedEstimatedTimeWithHours = `${formattedEstimatedTime} hours`;

        try {
            const add = {
                User: authUser,
                description: title.current.value,
                estimatedTime: formattedEstimatedTimeWithHours,
                materialsNeeded: materialsNeeded.current.value,
                title: title.current.value,
                userId: authUser.id
            }
            const response = await fetch("http://localhost:5000/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(add)
            });
            if (response.status === 201) {
                console.log(`Course: ${add.title} has been created`);
                navigate('/');
            } else if (response.status === 400) {
                const data = await response.json();
                setErrors(data.errors);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log(error);
            navigate('/error');
        }

    }

    const onCancel = (event) => {
        event.preventDefault();
        navigate('/');
    }

    return (
        <div className="wrap">
            <h2>Create Course</h2>
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
                <div className="main--flex">
                    <div>
                        <label htmlFor="courseTitle">Course Title</label>
                        <input id="courseTitle" name="courseTitle" type="text" defaultValue="" ref={title} />

                        <p>By {firstName} {lastName}</p>

                        <label htmlFor="courseDescription">Course Description</label>
                        <textarea id="courseDescription" name="courseDescription" ref={description} />
                    </div>
                    <div>
                        <label htmlFor="estimatedTime">Estimated Time</label>
                        <input id="estimatedTime" name="estimatedTime" type="text" defaultValue="" ref={estimatedTime} />

                        <label htmlFor="materialsNeeded">Materials Needed</label>
                        <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded} />
                    </div>
                </div>
                <button className="button" type="submit">Create Course</button>
                <button className="button button-secondary" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    )

}

export default CreateCourse
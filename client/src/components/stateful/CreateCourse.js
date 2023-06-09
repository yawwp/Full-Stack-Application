import React from 'react'
import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import CourseContext from '../../context/CourseContext';


/**
 * Create Course Page - POST Request
 */
function CreateCourse() {
    const navigate = useNavigate();
    const { authUser } = useContext(UserContext);
    const { updateCourses } = useContext(CourseContext).actions
    const { firstName, lastName } = authUser;

    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);
    const [errors, setErrors] = useState([]);

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const add = {
                User: { ...authUser },
                description: description.current.value,
                estimatedTime: estimatedTime.current.value,
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
                const newCourse = await response.json();
                updateCourses(oldCourses => [...oldCourses, newCourse]);
                navigate('/');
                window.location.reload();
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
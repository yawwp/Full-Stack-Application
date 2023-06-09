import React, { useContext, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseContext from '../../context/CourseContext'
import UserContext from '../../context/UserContext';

const UpdateCourse = () => {
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const updatedTitle = useRef(null);
    const updatedDesc = useRef(null);
    const updatedTime = useRef(null);
    const updatedMaterials = useRef(null);


    const { authUser, userCredentials, user } = useContext(UserContext);
    const { updateCourses } = useContext(CourseContext).actions;
    const { courses } = useContext(CourseContext);
    const { id } = useParams();
    const updatedId = parseInt(id) - 1;



    const usersCourses = courses.filter(course => authUser.id === course.userId);
    const course = usersCourses[updatedId];



    if (!course) {
        return <div> Loading..... </div>;
    } else {
        const { title, description, estimatedTime, materialsNeeded } = course;

        const onSubmit = async (event) => {
            event.preventDefault();

            const updatedCourse = ({
                User: authUser,
                description: updatedDesc.current.value,
                estimatedTime: updatedTime.current.value,
                materialsNeeded: updatedMaterials.current.value,
                title: updatedTitle.current.value,
                id: course.id,
                userId: authUser.id
            });

            const authHeader = btoa(`${authUser.emailAddress}:${user.password}`);
            const auth = `Basic ${authHeader}`
            const updateOptions = {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": auth,
                },
                body: JSON.stringify(updatedCourse)
            };

            try {
                const response = await fetch(`http://localhost:5000/api/courses/${course.id}`, updateOptions);
                if (response.status === 204) {
                    const data = courses.map(course => {
                        if (course.id === updatedCourse.id) {
                            return updatedCourse;
                        } else {
                            return course;
                        }
                    })
                    updateCourses(data);
                    navigate(-1);
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
            <>
                <div className="wrap">
                    <h2>Update Course</h2>
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
                                <input id="courseTitle" name="courseTitle" type="text" defaultValue={title} ref={updatedTitle} />

                                <p>By {authUser.firstName} {authUser.lastName}</p>

                                <label htmlFor="courseDescription">Course Description</label>
                                <textarea id="courseDescription" name="courseDescription" defaultValue={description} ref={updatedDesc} />
                            </div>
                            <div>
                                <label htmlFor="estimatedTime">Estimated Time</label>
                                <input id="estimatedTime" name="estimatedTime" type="text" defaultValue={estimatedTime} ref={updatedTime} />

                                <label htmlFor="materialsNeeded">Materials Needed</label>
                                <textarea id="materialsNeeded" name="materialsNeeded" defaultValue={materialsNeeded} ref={updatedMaterials} />
                            </div>
                        </div>
                        <button className="button" type="submit">Update Course</button><button className="button button-secondary" onClick={onCancel}>Cancel</button>
                    </form>
                </div>
            </>
        )

    }
}

export default UpdateCourse
import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseContext from '../../context/CourseContext'
import UserContext from '../../context/UserContext';


/**
 * Update Course Page - PUT Request
 * 
 * This page is to update data. 
 * 
 * The user needs to authenticated in order to get access to this page. 
 * The authenticated user would send a PUT request to the server, route
 * `http://localhost:5000/api/courses/${course.id}` and is prompted 
 * if any errors/validator's occur.
 * 
 * @returns updated information based on user's input
 */

const UpdateCourse = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const updatedTitle = useRef(null);
    const updatedDesc = useRef(null);
    const updatedTime = useRef(null);
    const updatedMaterials = useRef(null);


    const { authUser, user } = useContext(UserContext);
    const { singleCourse, courses } = useContext(CourseContext);
    const { updateCourses, fetchSingleCourse, fetchCourses } = useContext(CourseContext).actions;

    const { id } = useParams();
    const index = parseInt(id);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                await Promise.all([fetchSingleCourse(index), fetchCourses()]);
                setLoading(false);
            } catch (error) {
                console.error(error);
                navigate('/error');
            }
        };
        fetchCourse();
    }, [index]);

    useEffect(() => {
        if (!loading) {
            let array = courses.map(course => course.id);
            let checkerId = array.find(number => number === index);
            if (checkerId === undefined) {
                navigate('/notfound');
            } else {
                if (typeof (id) !== undefined && singleCourse.User.emailAddress !== user.emailAddress) {
                    navigate('/forbidden');
                }
            }
        }
    }, [loading]);


    try {
        if (!singleCourse) {
            return <div> Loading..... </div>;
        } else {
            const fName = singleCourse.User.firstName;
            const lName = singleCourse.User.lastName;
            const capitalizedFirst = fName.charAt(0).toUpperCase() + fName.slice(1);
            const capitalizedLast = lName.charAt(0).toUpperCase() + lName.slice(1);

            const { title, description, estimatedTime, materialsNeeded } = singleCourse;

            const onSubmit = async (event) => {
                event.preventDefault();

                const updatedCourse = ({
                    User: authUser,
                    description: updatedDesc.current.value,
                    estimatedTime: updatedTime.current.value,
                    materialsNeeded: updatedMaterials.current.value,
                    title: updatedTitle.current.value,
                    id: singleCourse.id,
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
                    const response = await fetch(`http://localhost:5000/api/courses/${singleCourse.id}`, updateOptions);
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
                    } else if (response.status === 401) {
                        navigate('/forbidden');
                    } else {
                        console.log('else');
                        throw new Error();
                    }
                } catch (error) {
                    navigate('/error');
                }

            }

            const onCancel = (event) => {
                event.preventDefault();
                navigate(`/courses/${id}`);
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

                                    <p>By {capitalizedFirst} {capitalizedLast}</p>

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
    } catch (error) {
        console.log(error);
    }
}

export default UpdateCourse
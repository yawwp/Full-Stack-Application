import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CourseContext from '../../context/CourseContext';
import UserContext from '../../context/UserContext';


function CourseDetail() {
    //Using the Parameters from localhost:3000/courses/:id
    const { id } = useParams();
    const index = parseInt(id);

    //Using navigate hook
    const navigate = useNavigate();

    //Course Context Properties
    const { courses, setCourses, singleCourse } = useContext(CourseContext);

    //Course Context Methods
    const { fetchSingleCourse, fetchCourses } = useContext(CourseContext).actions;

    //User Context Properties
    const { user, authUser } = useContext(UserContext);

    //States for loading and parameter searching
    const [coursesId, setCoursesId] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * 
     *  Use Effects 
     * 1) The first useEffect is awaiting the promises from  
     *      '/courses/:id', `/courses` and changing the state loading to false
     * 2) The second useEffect is for testing. Here we are creating an array of 
     *      the id's of all the courses and stored in the "coursesId" hook. 
     * 3) The third useEffect is the test. Since the data needs time to resolve,
     *      Setting a one second time out to fully wait for the data. 
     *      If the index matches somewhere, then the data is rendered to the page
     *      If the index does not match, then the data is navigated to the /error route
     */
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
            const array = courses.map(course => course.id);
            setCoursesId(array);
        }
    }, [loading]);

    useEffect(() => {
        if (loading || !coursesId.includes(index)) {
            const timeoutId = setTimeout(() => {
                navigate('/notfound');
            }, 1000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [loading, index, coursesId, navigate]);


    //Loading test
    if (!singleCourse || loading) {
        return <div>Searching....</div>
    } else {
        //Material Rendering
        const arrayMaterials = singleCourse.materialsNeeded.split('\n');
        const filteredMaterials = arrayMaterials.filter(material => material.trim() !== '');

        /**
         * Course Delete Handler
         * @param id - uses the param hook to search the id of the page. 
         */
        const handleCourseDelete = async (id) => {
            try {
                const authHeader = btoa(`${user.emailAddress}:${user.password}`);
                const auth = `Basic ${authHeader}`
                const deleteOptions = {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Authorization": auth
                    },
                };

                const response = await fetch(`http://localhost:5000/api/courses/${singleCourse.id}`, deleteOptions);

                if (response.status === 204) {
                    console.log(`${singleCourse.title} course has been deleted!`);
                    const updatedCourses = courses.filter(course => course.id !== id);
                    setCourses(updatedCourses);
                    navigate('/');
                } else if (response.status === 401) {
                    navigate('/forbidden');
                } else {
                    console.log(response.status);
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
                navigate('/error');
            }
        };
        return (
            <main>
                <div className="actions--bar">
                    <div className="wrap">
                        { authUser && authUser.emailAddress === singleCourse.User.emailAddress ?
                            <>
                                <Link className="button" to={`/courses/${id}/update`}>Update Course</Link>
                                <Link className="button" onClick={() => handleCourseDelete(singleCourse.id)} to="/">Delete Course</Link>
                            </>
                            :
                            <>
                            </>
                        }
                        <Link className="button button-secondary" to="/">Return to List</Link>
                    </div>
                </div>

                <div className="wrap">
                    <h2>Course Detail</h2>
                    <form>
                        <div className="main--flex">
                            <div>
                                <h3 className="course--detail--title">Course</h3>
                                <h4 className="course--name">{singleCourse.title}</h4>
                                <p>By {singleCourse.User.firstName} {singleCourse.User.lastName} </p>
                                <p> {singleCourse.description}</p>
                            </div>
                            <div>
                                <h3 className="course--detail--title">Estimated Time</h3>
                                <p>{singleCourse.estimatedTime}</p>

                                <h3 className="course--detail--title">Materials Needed</h3>
                                <ul className="course--detail--list">
                                    {
                                        filteredMaterials.map((material, index) => (
                                            <li key={index}> {material} </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        )
    }
}
export default CourseDetail
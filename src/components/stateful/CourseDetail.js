import React from 'react';
import { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CourseContext from '../../context/CourseContext';
import UserContext from '../../context/UserContext';


function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, authUser } = useContext(UserContext);
    const { courses } = useContext(CourseContext);
    const { updateCourses } = useContext(CourseContext).actions;

    const updatedId = id - 1;
    const usersCourses = courses.filter(course => authUser.id === course.userId);
    const course = usersCourses[updatedId];

    if (parseInt(id) === 0 || usersCourses.length < parseInt(id)) {
        navigate('/notfound');
    } else {
        if (!course) {
            return <div>Loading....</div>
        } else {
            const arrayMaterials = course.materialsNeeded.split('\n');
            const filteredMaterials = arrayMaterials.filter(material => material.trim() !== '');
            // const materials = filteredMaterials.map(material => material.substring(2));


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

                    const response = await fetch(`http://localhost:5000/api/courses/${id}`, deleteOptions);

                    if (response.status === 204) {
                        console.log(`${course.title} course has been deleted!`);
                        const updatedCourses = courses.filter((course) => course.id !== id);
                        updateCourses(updatedCourses);

                        <Link to='/' />


                    } else {
                        console.log(response.status);
                        throw new Error(`Error deleting course`);
                    }
                } catch (error) {
                    console.error(error);
                    navigate('/error');
                    // Handle error and display an appropriate message to the user
                }
            };


            return (
                <main>
                    <div className="actions--bar">
                        <div className="wrap">
                            <Link className="button" to={`/courses/${id}/update`}>Update Course</Link>
                            <Link className="button" onClick={() => handleCourseDelete(course.id)} to="/">Delete Course</Link>
                            <Link className="button button-secondary" to="/">Return to List</Link>
                        </div>
                    </div>

                    <div className="wrap">
                        <h2>Course Detail</h2>
                        <form>
                            <div className="main--flex">
                                <div>
                                    <h3 className="course--detail--title">Course</h3>
                                    <h4 className="course--name">{course.title}</h4>
                                    <p>By {authUser.firstName} {authUser.lastName} </p>
                                    <p> {course.description}</p>
                                </div>
                                <div>
                                    <h3 className="course--detail--title">Estimated Time</h3>
                                    <p>{course.estimatedTime}</p>

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
}

export default CourseDetail
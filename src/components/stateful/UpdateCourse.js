import React, { useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseContext from '../../context/CourseContext'
import UserContext from '../../context/UserContext';

const UpdateCourse = () => {
    const updatedTitle = useRef(null);
    const updatedDesc = useRef(null);
    const updatedTime = useRef(null);
    const updatedMaterials = useRef(null);

    const navigate = useNavigate();
    const { authUser } = useContext(UserContext);
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
                User:authUser,
                description: updatedDesc.current.value,
                estimatedTime:updatedTime.current.value,
                id: updatedId,
                materialsNeeded:updatedMaterials.current.value,
                title: updatedTitle.current.value,
                userId:authUser.id
            });

            // try {
            //     await fetch("http://localhost:5000/api/courses", {
            //     method:"PUT",
            //     headers:{
            //         headers: {
            //             "Content-Type": "application/json; charset=utf-8"
            //         },
            //         body: JSON.stringify(updatedCourse)
            //     }
            // });
            // } catch (error) {
                
            // }
            
        }

        const onCancel = (event) => {
            event.preventDefault();
            navigate('/');
        }

        return (
            <>
                <div className="wrap">
                    <h2>Update Course</h2>
                    <form onSubmit={onSubmit}>
                        <div className="main--flex">
                            <div>
                                <label htmlFor="courseTitle">Course Title</label>
                                <input id="courseTitle" name="courseTitle" type="text" defaultValue={title} ref={updatedTitle} />

                                <p>By Joe Smith</p>

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
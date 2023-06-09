import React, { useEffect,useState } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CourseContext from '../../context/CourseContext';
import UserContext from "../../context/UserContext";

function Courses() {
    const { authUser } = useContext(UserContext);
    const { courses } = useContext(CourseContext);
  
    const [filteredCourses, setFilteredCourses] = useState([]);
  
    useEffect(() => {
      if (authUser !== null) {
        const { id } = authUser;
        const coursesMatch = courses.filter((course) => course.userId === id);
        setFilteredCourses(coursesMatch);
      }
    }, [authUser, courses]);
  
    if (authUser === null) {
      return (
        <>
          <div className="wrap main--grid">Welcome to Courses Page</div>
          <h5>
            Please <Link to="/signin">Sign-in</Link> Or <Link to="/signup">Sign-up</Link> to continue
          </h5>
        </>
      );
    } else {
      return (
        <div className="wrap main--grid">
          {filteredCourses.map((course, index) => (
            <Link className="course--module course--link" key={index} to={`/courses/${index + 1}`}>
              <h2 className="course--label">Course</h2>
              <h3 className="course--title">{course.description}</h3>
            </Link>
          ))}
          <Link className="course--module course--add--module" to={'courses/create'}>
            <span className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              New Course
            </span>
          </Link>
        </div>
      );
    }
  }

export default Courses
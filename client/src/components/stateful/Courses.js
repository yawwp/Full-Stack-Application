import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CourseContext from '../../context/CourseContext';

/** 
 *  Main Courses Page
 *  Uses the fetch results from the Course Context
 *  The data is stored in the courses state inside the Course Context
 *  */ 
function Courses() {
    const { courses } = useContext(CourseContext);

      return (
        <div className="wrap main--grid">
          {courses.map((course, index) => (
            <Link className="course--module course--link" key={index} to={`/courses/${course.id}`}>
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

export default Courses
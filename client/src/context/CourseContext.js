import { createContext, useState, useEffect } from "react";

const CourseContext = createContext(null);

/**
 * 
 * Course Provider
 * 
 * Handles the GET requests from the client to the server.
 * We have 3 functions: 
 * 1) GET Request to get all courses
 * 2) GET Request to get a single course based on the parameter
 * 3) Call back function to update the courses state
 * 
 *  
 * The provider is used throughout the application
 */
export const CourseProvider = (props) => {
  const [courses, setCourses] = useState([]);
  const [singleCourse, setSingleCourse] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      };

      const response = await fetch("http://localhost:5000/api/courses", fetchOptions);
      if (response.status === 200) {
        const data = await response.json();
        setCourses(data);
      }
    };

    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    const response = await fetch("http://localhost:5000/api/courses", fetchOptions);
    if (response.status === 200) {
      const data = await response.json();
      setCourses(data);
    }
  };

  const fetchSingleCourse = async (id) => {
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    const response = await fetch(`http://localhost:5000/api/courses/${id}`, fetchOptions);
    if (response.status === 200) {
      const data = await response.json();
      setSingleCourse(data);
    } 
  };

  const updateCourses = (data) => {
    setCourses(data);
  }

  return (
    <CourseContext.Provider 
      value={{courses,setCourses,singleCourse,actions:{updateCourses,fetchCourses,fetchSingleCourse}}}>
      {props.children}
    </CourseContext.Provider>

  )
}

export default CourseContext;
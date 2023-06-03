import { createContext, useState, useEffect } from "react";


const CourseContext = createContext(null);

export const CourseProvider = (props) => {
  const [courses, setCourses] = useState([]);

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

  
  
  return (
    <CourseContext.Provider 
      value={{ courses }}>
      {props.children}
    </CourseContext.Provider>

  )
}

export default CourseContext;
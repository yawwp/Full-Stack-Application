import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CourseProvider } from './context/CourseContext';

// Components
import Courses from './components/stateful/Courses';
import UserSignIn from './components/stateful/UserSignIn';
import UserSignUp from './components/stateful/UserSignUp';
import UserSignOut from './components/stateless/UserSignout.js';
import CreateCourse from './components/stateful/CreateCourse';
import CourseDetail from './components/stateful/CourseDetail';
import UpdateCourse from './components/stateful/UpdateCourse';
import PrivateRoute from './components/stateful/PrivateRoute';
import Header from './components/stateless/Header';
import Forbidden from './components/stateless/Forbidden';
import NotFound from './components/stateless/NotFound';
import UnhandledError from './components/stateless/UnhandledError';


function App() {
  return (
    <>
      <Header />
      <CourseProvider>
        <Routes>
          <Route path='/' element={<Courses />} />
          <Route path='signin' element={<UserSignIn />} />
          <Route path='signup' element={<UserSignUp />} />
          <Route path='signout' element={<UserSignOut />} />
          <Route path='courses' element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route element={<PrivateRoute />}>
            <Route path='courses/create' element={<CreateCourse />} />
            <Route path={`/courses/:id/update`} element={<UpdateCourse />} />
          </Route>
          <Route path='/forbidden' element={<Forbidden/> } /> 
          <Route path='/notfound' element={<NotFound/> } /> 
          <Route path='/error' element={<UnhandledError/>} /> 
          <Route path='*' element={<NotFound/> } />
        </Routes>
      </CourseProvider>
    </>
  );
}
export default App;

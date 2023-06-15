import React from 'react'
import { Link } from 'react-router-dom'

//Error Page
function Error() {
  return (
    <>
          <div>ERROR! Please Navigate <Link to='/'>Home</Link></div>
    </>
  )
}

export default Error
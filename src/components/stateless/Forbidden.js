import React from 'react'
import { Link } from 'react-router-dom'

function Forbidden() {
  return (
    <>
          <div>Whoops.... Not Authorized.... Please Navigate Back <Link to='/'>Home</Link> </div>
    </>
  )
}

export default Forbidden
import React from 'react'
import { Link } from "react-router-dom";
 const Home = () => {
  return (
    <div>
      <h1>Timestampers</h1>
      <button><Link to='/timestamping' className='link' >  get file time stamped</Link></button>
      <button><Link to='/provider' className='link' >  become a provider</Link></button>
      <button><Link to ='/search' className='link'>search a file timestamp</Link></button>
    </div>
  )
}

export default Home;
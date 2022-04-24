import React from 'react'
import { Link } from "react-router-dom";
import fill from './undraw_certification_re_ifll.svg';
import './Home.css';

 const Home = () => {
  return (
    <div className='homeWrapper'>
      <div className='home'>
        <h1 className='head'>Timestampers</h1>
        <div className='buttonList'>
          <div className='buttonbox'>
            <div className='buttonLis'>
              <img src={fill} />
              <button><Link to='/timestamping' className='link' >  Get file time stamped</Link></button>
            </div>
          </div>
          <div className='buttonbox'>
            <div className='buttonLis'>
              <img src={fill} />
              <button><Link to='/providers' className='link' >  Become a provider</Link></button>
            </div>
          </div>
          <div className='buttonbox'>
            <div className='buttonLis'>
              <img src={fill} />
              <button><Link to='/search' className='link' >  Search a file timestamp</Link></button>
            </div>
          </div>
       
        {/* <button><Link to='/providers' className='link' >  Become a provider</Link></button>
        <button><Link to ='/search' className='link'>Search a file timestamp</Link></button> */}
        </div>
      </div>
    </div>
  )
}

export default Home;
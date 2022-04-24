import React, { useState } from 'react'
import { getRequester, getTimestamp } from '../getWeb3';
import { Link } from 'react-router-dom';
import './Search.css';


const Search = () => {
  const [hash,setHash]=useState('');
  const[owner,setOwner]=useState('');
  const[timestamp,setTimestamp]=useState('');
  const[resultDis,setResultDis]=useState(false);
  const getResult =(_data)=>{
    let time;
    let data ='0x'+_data;

    getRequester(data).then((res)=>{
      setOwner(res);
    });
    getTimestamp(data).then((res)=>{
      time=parseInt(res)*1000; 
      console.log(time);
      const dateObject = new Date(time);
    console.log(dateObject);
    let date = dateObject.toLocaleString();
    console.log(date);
    setTimestamp(date);
    });
    
    setResultDis(true);
  }

  return (
    <div>
      <h1 className='searchHead'>Search for your timestamp here <button className='return' > <Link to='/'> Return to home</Link></button> </h1>
      <div className='mainbox'>
       
      <div style={{width:"1000px"}}> 

     
     
      <form onSubmit={(e)=>{getResult(hash);e.preventDefault();}} className='searchForm'> 
        <div className='rat'>
          Enter the hash here:
        </div>
        <input type='text'name='search'onChange={(e)=>{setHash(e.target.value);} } style={{width:"400px",height:"30px"}   } />
          <button  type='submit'className='searchButton' >Search</button>
      </form>
     
      {resultDis &&
      <div className='search'>
        <div className='ssub'>
          <b>
            file hash:
          </b>
          <p>
            {hash}
          </p>
        </div>
        <div className='ssub'>
          <b>
            owner:
          </b>
          <p>
            {owner}
          </p>
        </div>
        <div className='ssub'>
          <b>
            timestamp:
          </b>
          <p>
            {timestamp}
          </p>
        </div>
        
      </div>
      
      }
       </div>
       
      </div>
    </div>
  )
}

export default Search
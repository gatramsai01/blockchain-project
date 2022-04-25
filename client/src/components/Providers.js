import React, { useEffect, useState } from 'react'
import Web3 from 'web3';
import {dataEvent, getAccount, getData, getOrderT2, getStampers, getState2, getState1, joinStamper, revealCommitment, sendCommitment, getOrderT3 } from '../getWeb3'
import './Providers.css';
 const Providers = () => {
  const [register,setRegister]=useState(false);
  const [bail,setBail]=useState('0');
  const [bailWarn,setBailWarn]=useState('');
  const [counter,setCounter] = useState(0);
  const[wait,setWait]=useState('');
  const[fileHash,setFileHash]=useState('')
  function delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }


  useEffect(()=>{
    let account;
// checking if registered
    getAccount().then((res)=>{
      account=res;
      console.log(typeof account);
      console.log("local account:"+account)
      getStampers().then((res)=>{
        // console.log(typeof res);
        res.forEach(element => {
          // console.log(typeof element);
          // console.log('account in blockchain:'+element)
          // console.log();
          if(toString( account) ===toString( element)){
            console.log("in if block")
            setRegister(true);
          }
        });
      });
    });

    
    

    console.log(register);

//after registered
    if(register){
      getState1().then((res)=>{
        console.log(`state1 : ${res}`);
        // state update
        if(res == '0')
        {
          // updating the state for continous updation
          setCounter(1-counter);
          setWait('Waiting for file hash')
          console.log(`Updated the counter state`);
        }
        else{
         getData().then((res)=>{
           let hash =res;
           const timestamp=Math.floor(Date.now()/1000);
          const nonce=Math.floor(Math.random()*100);
          let commitment =  Web3.utils.soliditySha3({type:'string',value:hash},timestamp,nonce);
          console.log(commitment);
          sendCommitment(hash,commitment).then(()=>{
            console.log('commit is sent');
            getOrderT2(hash).then(async(res)=>{
              const time=Math.floor(Date.now()/1000);
              const t2=parseInt(res);
              console.log("current time:"+time)
              console.log("deadline:"+t2)
              for(let i=time; i<t2;i++){
                console.log(t2-i);
                await delay(1000);
              }
              revealCommitment(hash,timestamp,nonce).then((res)=>{
                getState2().then((res)=>{
                  console.log("state2:"+res)
                })
              })
            })
          })
         })

         

        }

      })
    }

    })

    const registerStamper=(_bail)=>{
      if(_bail>='1'){
        joinStamper(_bail).then((res)=>{
          setRegister(true);
          console.log(register)
          });
          setBailWarn('');
      }
      else{
        setBailWarn('Minium deposit is 1 ether')
      }
     
    }

    if(!register){
      return(<div className=''>
        <div className='time'>

        
        <h1>Register for Timestamping</h1>
        </div>
        <div className='timer'>
      <form onSubmit={(e) =>{registerStamper(bail);e.preventDefault()}}>
        <label>
          Enter deposit amount in ether:
        <input type='text' name='bail' onChange={(e)=>{setBail(e.target.value)}}/>
        </label>
        <button type='submit'>register</button>
      </form>
      </div>
     
      <p>{bailWarn}</p>
      </div>)
    }
    else{
      return(<div>
        <p>{wait}</p>
        
      </div>)
    }

// return(
//   <div>
//     {register &&
//       <div>
      // <h1>register for Timestamping</h1>
      // <form onSubmit={registerStamper(bail)}>
      //   <input type='number' name='bail' onChange={(e)=>{setBail(e.target.value)}}/>
      //   <button type='submit'>register</button>
      // </form>
//       </div>
//     }
//     {!register &&
//       <div>hello</div>
//     }
//   </div>
// )

}
export default Providers;
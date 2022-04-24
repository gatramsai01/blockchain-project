import React, { useEffect, useState } from 'react'
import Web3 from 'web3';
import {dataEvent, getAccount, getData, getOrderT2, getStampers, getState2, getState1, joinStamper, revealCommitment, sendCommitment, getOrderT3 } from '../getWeb3'

 const Providers = () => {
  const [register,setRegister]=useState(false);
  const [bail,setBail]=useState('0');
  const [bailWarn,setBailWarn]=useState('');

  const [counter,setCounter] = useState(0);
  const[wait,setWait]=useState('');
  const[sendCommit,setSendCommit]=useState('');
  const[revealCommit,setRevealCommit]=useState('');
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

    getAccount().then((res)=>{
      account=res;
      console.log(account);
      getStampers().then((res)=>{
        res.forEach(element => {
          if(account===element){
            
            console.log("in if block")
            setRegister(true);
            return false;
          }
          else{
            console.log("in else block")
          return true;
        }
        });
      });
    });

    // checking if registered
    

    console.log(register);
    if(register){
      getState1().then((res)=>{
        console.log(`state1 : ${res}`);
        // state update
        if(res == 0)
        {
          // updating the state for continous updation
          setCounter(1-counter);
          setWait('Waiting for file hash')
          console.log(`Updated the counter state`);
        }
        else{
         getData().then((res)=>{
           setWait('');
           let hash =res;
           setFileHash(hash);
           const timestamp=Math.floor(Date.now()/1000);
          const nonce=Math.floor(Math.random()*100);
          let commitment =  Web3.utils.soliditySha3({type:'string',value:hash},timestamp,nonce);
          console.log(commitment);
          sendCommitment(hash,commitment).then(()=>{
            setSendCommit('')
            setSendCommit(`you have sent commitment to timestamp ${fileHash}`)
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
                setSendCommit('');
                setRevealCommit(`you have revealed the commit of ${fileHash}`);
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
        <h1>register for Timestamping</h1>
      <form onSubmit={(e) =>{registerStamper(bail);e.preventDefault()}}>
        <label>
          Enter deposit amount in ether:
        <input type='text' name='bail' onChange={(e)=>{setBail(e.target.value)}}/>
        </label>
        <button type='submit'>register</button>
      </form>
      <p>{bailWarn}</p>
      </div>)
    }
    else{
      return(<div>
        <p>{wait}</p>
        <p>{sendCommit}</p>
        <p>{revealCommit}</p>
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
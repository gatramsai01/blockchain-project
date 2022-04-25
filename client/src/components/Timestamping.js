 import React,{useState} from 'react'
import{getOrderT3, getStatus, getTimestamp, requestTimestamp, selectStampRequester} from '../getWeb3'
import './Timestamp.css';




const Timestamping = () => {
const [data,setData ] = useState('');
const [deposit,setDeposit]=useState(0);
const [tx,setTx]=useState('');
const [display, setDisplay] = useState(true);
const [timer, setTimer] = useState(0);
const [stat,setStat]=useState('');
const [stamp,setStamp]=useState('')
function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

const sendData=(_data,_deposit)=>{
  let data ="0x"+_data;
  let status;
  getStatus(data).then((res) => {
    status = res;
    console.log(status);
    if(status === '0'||status==='2') {
      console.log("In if block")
      console.log(typeof deposit);
      if (_deposit>='0.01'){
          requestTimestamp(data,_deposit).then((res) => {
          console.log(res);
          setDisplay(false);
          setTx('Transaction is succesful')
          //  get t3
          getOrderT3(data).then(async (res) => {
            const time = Math.floor(Date.now() / 1000);
            const resTime = parseInt(res)+3;
            console.log('select'+resTime-time)
            for(let i = time; i < resTime; i++) {
              console.log(resTime-i);
              setTimer(resTime-i);
              await delay(1000);
            }
            console.log("Function run..")
            console.log("data:"+data);
            selectStampRequester(data).then((res) => {
              getTimestamp(data).then((res)=>{
                const dateObject = new Date(parseInt(res)*1000);
                let date = dateObject.toLocaleString();
                setStamp(date);
              })
              console.log(res);
            })
          })
        });
       
      }
      else{
            setTx('minimum deposit is 0.01 ')
            setStat('')
      }
    } else if(status == '1') {
      console.log(status);
      setStat('this file hash is already timestamped')
    }
  });
}


  return (
    
    <div className='app2'>
      <h1>Get your file timestamped here</h1>
      {display &&<div className='app3'>
        
        
        <form onSubmit={(e) => {sendData(data,deposit); e.preventDefault()}} className='f'>
          <label>
            Enter the hash here:
          <input type='text'className='texts1' name='data' onChange = {(event )=> {setData(event.target.value);
          console.log(event.target.value)}}/>
          </label>
          <label>
            Enter the deposit amount:
          <input type='text'className='texts' name='deposit'onChange={(event)=>{setDeposit(event.target.value)}}/>
          </label>
          <button type='submit' className='submit'>Get timestamp</button>
        </form>
        <p>{stat}</p>
        <p>{tx}</p>
        </div>
      }
      
      {!display && <div>
      <p>{tx}</p>
        <p>wait for {timer} seconds for timestamp</p>
        </div>
      }
        <p>timestamp:<b>{stamp}</b></p>

    </div>
  )
}

export default Timestamping;
import React,{useState} from 'react'
import{getOrderT3, getStatus, requestTimestamp, selectStampRequester} from '../getWeb3'

const Timestamping = () => {
const [data,setData ] = useState('');
const [deposit,setDeposit]=useState(0);;
const [tx,setTx]=useState('');
const [display, setDisplay] = useState(true);
const [timer, setTimer] = useState(0);

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
    if(status === '0') {
      console.log("In if block")
      if (_deposit>=0.01){
          requestTimestamp(data,_deposit).then((res) => {
          console.log(res);
          setDisplay(false);
          getOrderT3(data).then(async (res) => {
            console.log(res);
            const time = Math.floor(Date.now() / 1000);
            const resTime = parseInt(res);
            for(let i = time; i < resTime; i++) {
              console.log(resTime-i);
              setTimer(resTime-i);
              await delay(1000);
              // setTimeout(function() {
              //   console.log()
              // }, 100000);
            }
            console.log("Function run..")
            selectStampRequester(data).then((res) => {
              console.log(res);
            })
          })
        });
        setTx('Transaction succesful ')
      }
      else{
            setTx('minimum deposit is 0.01 ')
      }
    } else if(status === 1) {
      console.log(status);
    }
  });
}


  return (
    <div>
      {display &&
        <form onSubmit={(e) => {sendData(data,deposit); e.preventDefault();}} >
          <label>
            enter the hash here:
          <input type='text' name='data' onChange = {(event )=> {setData(event.target.value);
          console.log(event.target.value)}}/>
          </label>
          <label>
            enter the deposit amount:
          <input type='number' name='deposit'onChange={(event)=>{setDeposit(event.target.value)}}/>
          </label>
          <button type='submit'>get timestamp</button>
        </form>
      }
      <p>{tx}</p>
      {!display && 
        <p>{timer}</p>
      }
    </div>
  )
}

export default Timestamping;
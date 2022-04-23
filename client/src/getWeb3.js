import Web3 from 'web3';
import Timestamping from './contracts/Timestamping.json'


let selectedAccount;
let contract;
let isReady = false;

export const init = async () => {
	let provider = window.ethereum;

	if (typeof provider !== 'undefined') {
		provider
			.request({ method: 'eth_requestAccounts' })
			.then((accounts) => {
				selectedAccount = accounts[0];
				console.log(`Connected Account address: ${selectedAccount}`);
			})
			.catch((err) => {
				console.log(err);
				return;
			});

		window.ethereum.on('accountsChanged', function (accounts) {
			selectedAccount = accounts[0];
			console.log(`Current Account address: ${selectedAccount}`);
		});
	}

	const web3 = new Web3(provider);

    const networkId = await web3.eth.net.getId();

    try{
        contract = new web3.eth.Contract(Timestamping.abi, Timestamping.networks[networkId].address);
    } catch(err) {
        console.log(err);
    }

    isReady = true;

};


export const getAccount =async()=>{
  if(!isReady) {
    await init();
}
  return selectedAccount;
}


// send functions
export const requestTimestamp=async(data,deposit)=>{
  if(!isReady) {
    await init();
}
  return contract.methods.requestTimestamp(data).send({from:selectedAccount,value:Web3.utils.toWei(deposit,'ether')})
}

export const joinStamper =async(deposit)=>{
  if(!isReady) {
    await init();
}
return contract.methods.joinStamper().send({from:selectedAccount,value:Web3.utils.toWei(deposit,'ether')});
}

export const sendCommitment =async(_data,_commiment) =>{
  if(!isReady) {
    await init();
}
return contract.methods.sendCommitment(_data,_commiment).send({from:selectedAccount})
}

export const revealCommitment= async(_data,_time,_nonce)=>{
  if(!isReady) {
    await init();
}
return contract.methods.requestTimestamp(_data,_time,_nonce).send({from:selectedAccount});
}

export const selectStampRequester =async(_data) =>{
  if(!isReady) {
    await init();
}
return contract.methods.selectStampRequester(_data).send({from:selectedAccount});
}


// get functions

export const getOrderT1 =async(_data)=>{
  if(!isReady) {
    await init();
}
return contract.methods.getOrderT1(_data).call({from:selectedAccount});
}

export const getOrderT2 =async(_data)=>{
  if(!isReady) {
    await init();
}
return contract.methods.getOrderT2(_data).call({from:selectedAccount});
}

export const getOrderT3 =async(_data)=>{
  if(!isReady) {
    await init();
}
return contract.methods.getOrderT3(_data).call({from:selectedAccount});
}

export const getStampers = async()=>{
  if(!isReady) {
    await init();
}
return contract.methods.getStampers().call({from:selectedAccount});
}

export const getStatus = async (_data)=>{
  if(!isReady) {
    await init();
}
return contract.methods.getStatus(_data).call({from:selectedAccount})
}

export const getBalance =async ()=>{
  if(!isReady) {
    await init();
}
  return contract.methods.getBalance().call({from:selectedAccount});
}
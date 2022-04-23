import React, { Component, useEffect, useState } from "react";
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom";
import {getAccount, init} from "./getWeb3";
import Home from "./components/Home";
import Timestamping from "./components/Timestamping";
import Providers from "./components/Providers";
import Search from "./components/Search";

import "./App.css";

const App =() =>{
  
  useEffect(()=>{
   let hello= init();
   let account = getAccount();
   console.log(account);

  })

  return(
<div>
  <Router>
    <Routes>
    <Route exact path="/" element={<Home/>} />
    <Route path="/timestamping" element={<Timestamping/>} />
    <Route path="/providers" element={<Providers/>} />
    <Route path="/search" element={<Search/>} />
    </Routes>
  </Router>
</div>
  )
 
}

export default App; 
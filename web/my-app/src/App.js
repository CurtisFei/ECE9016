import './App.css';
import HomeContent from './components/HomeContent';
import SearchTrackContent from './components/SearchTrackContent';
import DisplayPlaylistContent from './components/DisplayPlaylistContent';
import CreatePlaylistContent from './components/CreatePlaylistContent';
import UserManagementContent from './components/UserManagementContent';
import ReviewManagementContent from "./components/ReviewManagementContent";
import TermsAndPolicyContent from "./components/TermsAndPolicyContent";
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Account from './components/Account'
import { useState, createContext, useEffect } from 'react';
import axios from 'axios';

const LoginStates = createContext([])


function App() {
  
  //const [token,setToken] = useState(window.localStorage.getItem("token"))
  const [isLogin, setLogin] = useState(false)
  const [groupID, setGroupID] = useState(0);




useEffect(()=>{
  const Token = window.localStorage.getItem("access_token");
  if(Token){
    
    getInformation(Token);
  }
  else{
    setLogin(false)
    setGroupID(0)
  }
})


const getInformation = async (value) =>{
  await axios.get("/cms/user/information",{
    headers: {
      Authorization: `Bearer ${value}`,
    },
  }).then((res)=>{
    setGroupID(res.data.groups[0].id);
  }).catch((err)=>{
    console.log(err)
  })
}


  return (
    <LoginStates.Provider value={{groupID, setGroupID}}>
    
    <Router>
      <Layout>
          <Routes>
          <Route path ='/HomeContent' element={<HomeContent/>}/>
          <Route path ='/SearchTrackContent' element={<SearchTrackContent/>}/>
          <Route path ='/DisplayPlaylistContent' element={<DisplayPlaylistContent/>}/>
          <Route path ='/CreatePlaylistContent' element={<CreatePlaylistContent/>}/>
          <Route path='/UserManagementContent' element={<UserManagementContent/>}/>
          <Route path='/ReviewManagementContent' element={<ReviewManagementContent/>}/>
          <Route path='/TermsAndPolicyContent' element={<TermsAndPolicyContent/>} />
           <Route 
            path ='/SignIn' 
            element={
            <SignIn 
              handleSignIn={setGroupID} 
              // updateJWT={setToken}
            />}
          /> 
          <Route path ='/Account' element={<Account/>}/>
          <Route path ='/SignUp' element={<SignUp/>}/>
          <Route exact path="/" element={<Navigate to ='/HomeContent' replace />}/>  
          
          </Routes>
          </Layout>
          
      </Router>
    </LoginStates.Provider>
  );
}

export default App;
export {LoginStates}

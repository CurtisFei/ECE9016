import React from 'react';
//import { ReactDOM } from 'react';
//import { Link } from 'react-router-dom';
import { useState, createContext, useContext } from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink
    } from "./NavElements.js";

import { LoginStates } from '../App.js';

const Navbar = () => {
  const {isLogin, setLogin, groupID, setgroupID} = useContext(LoginStates)
  
  // const value = React.useContext(isLogin); 
  // console.log("----" + LoginStates);
  // const isLogin = useContext(isLogin)
    return (
      <>
        <Nav>
          <NavLink to='/'>
              Meta Music Apps
          </NavLink>
          <Bars />
          <NavMenu>
          
          
            <NavLink to='/SearchTrackContent'>
              Search Tracks 
            </NavLink>

            <NavLink to='/DisplayPlaylistContent'>
                  Play Lists
                </NavLink>
            
            { (groupID == 1)? 
            <>
               <NavLink to='/UserManagementContent'>
                  User Management
                </NavLink>
                <NavLink to='/ReviewManagementContent'>
                  Review Management
                </NavLink>
            </>
              : <></>
            }

            {/* <NavLink to='/xx' activeStyle>
              Play Lists
            </NavLink> */}
            
            {/* Second Nav */}
            {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
          </NavMenu>

          <NavMenu>
          {(groupID > 0)?
            <NavBtn>
            <NavBtnLink to='/Account' >Account</NavBtnLink>
          </NavBtn>
          :<NavBtn>
            <NavBtnLink to='/SignIn' >Sign In</NavBtnLink>
          </NavBtn>
          }


          <NavBtn>
            <NavBtnLink to='/SignUp'>Sign Up</NavBtnLink>
          </NavBtn>
          </NavMenu>
        </Nav>
      </>
    );
  };
  
  export default Navbar;


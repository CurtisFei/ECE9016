import React from 'react'
import { useState } from 'react';
import { useContext } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LoginStates } from '../App.js';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Alert from "@mui/material/Alert";
import axios from 'axios';



function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="/HomeContent">
          Meta Music App
        </Link>{''}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
  const theme = createTheme();
  
  export default function Account({}) {
    // const {isLogin, setLogin} = useContext(LoginStates)
    const {groupID, setGroupID} = useContext(LoginStates)
    const [userEmail, setuserEmail] = useState(window.localStorage.getItem("email"))
    const [Token, setToken] = useState(window.localStorage.getItem("access_token"))
    const [isUpdate, setUpdate] = useState(false);
    const [OldPassword, setOldPassword] = useState("")
    const [NewPassword, setNewPassword] = useState("")
    
    const [isValidated, setValidation] = useState(true);
    const [isSuccess, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const oldPassword = data.get("OldPassword");
      const newPassword = data.get("NewPassword");
      

      if (oldPassword.length > 0 && newPassword.length > 0) {
        setValidation(true);
      } else {
        setValidation(false);
      }

      if(isValidated){
        console.log("access token is " + Token)
          const res = await axios.put("/cms/user/change_password",{
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: newPassword
          },{
            headers: {
              Authorization: `Bearer ${Token}`
            }
          }).then(res=>{
            setSuccess(true);
            console.log(res.data.message);
            console.log(res.data);
          }).catch(function(error){
            console.log(error.response);
          })
      }
      
    };
    
    const navigate = useNavigate();
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {(isSuccess) &&(
              <>
              <Alert severity="success">password reset successfully</Alert>
              </>
            )}
            {!isValidated && (
              <Alert severity="error">Please Complete the Form</Alert>
            )}

              <>
                

              {(isUpdate) ? 
                <>
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
            <Typography component="h1" variant="h5">
              Update Password
            </Typography>
                <Typography component="h1" variant="h5" align="center">
                  You are Logged in as {userEmail}
                </Typography>
                <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="OldPassword"
                  label="Old Password"
                  name="OldPassword"
                  type="password"
                  autoComplete="Old Password"
                  autoFocus
                  onBlur={(e) => setOldPassword(e.target.value)}
                  error={OldPassword === ""}
                  helperText={OldPassword === "" ? "Field is empty" : ""}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="NewPassword"
                  label="New Password"
                  type="password"
                  id="NewPassword"
                  autoComplete="current-password"
                  onBlur={(e) => setNewPassword(e.target.value)}
                  error={NewPassword === ""}
                  helperText={NewPassword === "" ? "Field is empty" : ""}
                />
               
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Confirm Update
                </Button>

                <Button
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    console.log("token removed")
                    setGroupID(0);
                    navigate('/SignIn')
                  }}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Logout
                </Button>
                
              </Box>
                </>
                :
            <>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
                <Typography component="h1" variant="h5" align="center">
                  You are Logged in as {userEmail}
                </Typography>
                <Button
                  onClick={() => {
                    setUpdate(true);
                  }}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Update Password
                </Button>

                <Button
                  onClick={() => {
                    setGroupID(0);
                    localStorage.removeItem("access_token");
                    console.log("token removed")
                    
                    navigate('/SignIn')
                  }}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Logout
                </Button>
                

            </>}

              
              </>
          </Box>

          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    );
  }
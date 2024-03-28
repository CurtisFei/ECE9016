import React from 'react'
import { useState,useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from "@mui/material/Alert";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { message } from 'antd';


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
  
  export default function SignIn({handleSignIn, handleUserRole}) {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValidated, setValidation] = useState(true);
    const [isLogin, setLogin] = useState(false);
    const [isCorrect,setCorrect] = useState(true);
    const [groupID, setGroupID] = useState(0);
    // const [Token, setToken] = useState(window.localStorage.getItem("access_token"));
    
    
    useEffect(() => {
      handleSignIn(groupID); // pass info back to parent
    }, [groupID]);

    const navigate = useNavigate()
    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let customerEmail = data.get("email");
      const customerPassword = data.get("password");
      
      if(customerEmail == "administrator"){
        customerEmail = customerEmail+"@163.com";
        console.log(customerEmail)
      }

      if (customerEmail.length > 0 && customerPassword.length > 0) {
        setValidation(true);
      } else {
        setValidation(false);
      }

      if (isValidated) {
        //setLogin(true);
        const res = await axios.post("/cms/user/login", {
          username: customerEmail,
          password: customerPassword,
        }).then(res =>{
          if(res.data){
            // setLogin(true);
            setCorrect(true);
            // console.log(res.data);
            //console.log(res.data.access_token)
            window.localStorage.setItem("email",customerEmail);
            window.localStorage.setItem("access_token",res.data.access_token)
            //call function get information
            getInformation(res.data.access_token);
          } 
        }).catch(function(error){
          // console.log(error)
          setCorrect(false)
          message.error(error.response.data.message)
        });
      }
      // console.log({
      //   email: data.get("email"),
      //   password: data.get("password"),
      // });
    };

    const VarifyEmail = async (event) =>{
      event.preventDefault();
      
      if (isValidated) {
        const currentEmail = email
        if(!currentEmail.length){
          message.error("Please input the email address you want to varify.")
          return;
        }
        const res = await axios.post("/cms/user/resend", {
          email: currentEmail,
        }).then(res =>{
          if(res.data){
            message.success(res.data.message);
            console.log(res)
          } 
        }).catch(function(error){
            
              setCorrect(false)
              message.error(error.response.data.message)
            if(error.response.status === 401){
              message.error("You are Unauthorized, please varify your email address")
            }
        });
      }
    } 


    const getInformation = (value) =>{
      console.log(value);
      axios.get("/cms/user/information",{
        headers: {
          Authorization: `Bearer ${value}`,
        },
      }).then((res)=>{
        console.log(res.data.groups[0].id);
        setGroupID(res.data.groups[0].id);
      }).catch((err)=>{
        console.log(err)
      })
    }

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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {/* if user input is invalid, show alert message on the screen */}
            {!isValidated && (
              <Alert severity="error">Please Complete the Form</Alert>
            )}
            {!isCorrect && (
              <Alert severity="error">logged in was unsuccessful, please try again.</Alert>
            )}

            {(groupID > 0) && (
              <>
                <Typography component="h1" variant="h5" align="center">
                  You are Logged in as {email}
                </Typography>

                <Button
                  onClick={() => {
                    // setLogin(false);
                    setGroupID(0);
                    localStorage.removeItem("access_token");
                    
                  }}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Logout
                </Button>
              </>
            )}

            {groupID === 0 && (
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onBlur={(e) => setEmail(e.target.value)}
                  error={email === ""}
                  helperText={email === "" ? "Field is empty" : ""}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onBlur={(e) => setPassword(e.target.value)}
                  error={password === ""}
                  helperText={password === "" ? "Field is empty" : ""}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                  <Button
                  onClick={VarifyEmail}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, ml: -2 }}
                >
                  Varify Your Email
                </Button>
                  </Grid>
                  <Grid item xs>
                  <Button
                  onClick={() => {
                    navigate('/SignUp',{replace: true})
                  }}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, ml:2 }}
                  
                >
                  Sign Up
                </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    );
  }
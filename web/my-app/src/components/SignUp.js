import * as React from 'react';
import { useState } from 'react';
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
import { message, Space } from 'antd';
import Alert from "@mui/material/Alert";
import axois from 'axios';



function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="/HomeContent">
          Meta Music App
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
  const theme = createTheme();
  
  export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUsername] = useState('')
    const [isValidated, setValidation] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const customerEmail = data.get('email');
      const customerPassword = data.get('password');
      const customerUsername = data.get('userName');
      

      if(customerEmail.length > 0 && customerPassword.length > 0 ){
        
        const res = await axois.post("/cms/user/register", {
          username: customerEmail,
          password: customerPassword,
          confirm_password: customerPassword,
          email: customerUsername,
          group_ids:[
            2
          ]
        }).then(res=>{
          // console.log(res.data);
          message.success(res.data.message)
          setValidation(true)
        }).catch(function(error){
          // console.log(error)
          message.error(error.response.data.message[0])
          // message.error(error.message + ",\nPlease enter the correct format of the information")
          setValidation(false)
        });
      }else{
        setValidation(false)
        message.error("Empty Input, please fill out the blank")
      }
    };

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
              Sign up
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
            
            {/* if user input is invalid, show alert message on the screen */}
              { !isValidated && (
                <Alert severity="error">Please Complete the Form</Alert>
              )}
              { isValidated === true && (
                <Alert severity="success">You have Successful SignUp</Alert>
                
              )}
             
              <Grid container spacing={2}>
               
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="userName"
                    label="User Name"
                    name="userName"
                    autoComplete="userName"
                    onBlur={(e) => setUsername(e.target.value)}
                    error={userName === ""}
                    helperText={userName === "" ? "Field is empty" : ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onBlur={(e) => setEmail(e.target.value)}
                    error={email === ""}
                    helperText={email === "" ? "Field is empty" : ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onBlur={(e) => setPassword(e.target.value)}
                    error={password === ""}
                    helperText={password === "" ? "Field is empty" : ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/SignIn" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    );
  }
import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useHistory } from 'react-router-dom';
import Copyright from './copyright'
import { useSetRecoilState } from 'recoil'
import { userData, isLoggedIn } from '../atoms';

//IMAGE
import bg from '../images/bg.svg';

//MUI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import indigo from '@material-ui/core/colors/indigo';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
    image: {
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'repeat',
        backgroundColor: indigo[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '92vh',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    spacing: {
        margin: theme.spacing(3),
    },
    snackbar: {
        paddingBottom: theme.spacing(3),
    },
}));

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

export default function SignIn() {

    const setUser = useSetRecoilState(userData);
    const setLogin = useSetRecoilState(isLoggedIn);

    const history = useHistory();
    const initialFormData = Object.freeze({
        email: '',
        password: '',
    });

    const [formData, updateFormData] = useState(initialFormData);
    const [emailerror, setEmailerror] = useState(false);
    const [passerror, setPasserror] = useState(false);
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);
    
    const [message, setMessage] = useState("Invalid Login Credentials! Please Try Again");

    const handleChange = (e) => {

        setEmailerror(false)
        setPasserror(false)

        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(formData);

        // Validation
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let submit = true

        setEmailerror(false)
        setPasserror(false)

        if (formData.email === "" || !re.test(formData.email)) {
            setEmailerror(true)
            submit = false
            console.log(submit)
            console.log(formData.email)
        }
        if (formData.password === "" || formData.password.length < 6) {
            setPasserror(true)
            submit = false
            console.log(submit)
            console.log(formData.password)
        }


        if (submit) {
            axiosInstance
                .post(`auth/login`, {
                    "email": formData.email,
                    "password": formData.password,
                })
                .then((res) => {
                    console.log(res);
                    console.log(res.data);

                    localStorage.setItem('access_token', res.data.user_data.tokens.access);
                    localStorage.setItem('refresh_token', res.data.user_data.tokens.refresh);

                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');


                    setUser({
                        name: res.data.teacher_name || res.data.student_name,
                        email: res.data.teacher_email || res.data.student_email,
                        id: res.data.teacher_id || res.data.student_id,
                        user_id: res.data.user_id,
                        user_type: res.data.user_type,
                        profile_picture: `http://127.0.0.1:8000${res.data.profile_picture}`,
                    });

                    setLogin(true);

                    history.push('/dashboard');

                })
                .catch(err => { 
					console.log(err)
					if (err.response.status === 401 && err.response.data.detail === "Invalid credentials, try again") {
						setTransition(() => TransitionLeft);
						setOpen(true);
					}
					else if (err.response.status === 401 && err.response.data.detail === "Email is not verified") {
                        setMessage("Please validate your email! Check your inbox")
						setTransition(() => TransitionLeft);
						setOpen(true);
					}
				});
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const classes = useStyles();

    return (
        <Container maxWidth="xl" disableGutters={true} className={classes.image}>
            <Grid container component="main" spacing={0} direction="row" alignItems="center" justify="center">
                <Grid item className={classes.spacing}>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}></Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={classes.form}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={handleChange}
                                error={emailerror}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                                error={passerror}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleSubmit}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/forgot-password" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Box mt={5}>
                                <Copyright />
                            </Box>
                        </form>
                    </div>
                    <Snackbar
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={transition}
                        message={message}
                        key={transition ? transition.name : ''}
                        className={classes.snackbar}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

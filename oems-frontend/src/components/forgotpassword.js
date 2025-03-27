import React, { useState } from 'react';
import axiosInstance from '../axios';
import AlertDialog from "./AlertDialog";

//IMAGE
import study4 from '../images/study4.svg';

//MUI
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import indigo from '@material-ui/core/colors/indigo';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundImage: `url(${study4})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: indigo[50],
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        height: '92vh',
    },
    paper: {
        marginTop: theme.spacing(24),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    spacing: {
        margin: theme.spacing(3),
    },
    gridspacing: {
        marginLeft: theme.spacing(2),
    },
}));

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [emailerror, setEmailerror] = useState(false);

	//Snackbar
	const [open, setOpen] = useState(false);
	const [transition, setTransition] = useState(undefined);

	//AlertDialog
	const [openState, setOpenState] = useState(false);
	const openDialog = () => setOpenState(true);
	const closeDialog = () => setOpenState(false);

    const handleChange = (e) => {
        setEmailerror(false)
        setEmail(e.target.value.trim())
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(email);

        // Validation
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let submit = true

        setEmailerror(false)

        if (email === "" || !re.test(email)) {
            setEmailerror(true)
            submit = false
            console.log(submit)
            console.log(email)
        }


        if (submit) {
            axiosInstance
                .post(`auth/request-reset-email`, {
                    "email": email
                })
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    openDialog();
                })
                .catch(err => { 
					console.log(err)
					if (err.response.status === 400) {
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
        <Container disableGutters={false} maxWidth="xl" className={classes.background}>
            <Grid container direction="row" className={classes.gridspacing}>
                <Grid item>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Box fontSize={25} fontWeight="fontWeightBold">
                            Enter Email to Get your Password Reset Link
                        </Box>
                        <form className={classes.form}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
                                error={emailerror}
                            />
                            <Button
                                type="submit"
                                fullWidth={false}
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/" variant="body2">
                                        Back to Home
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Snackbar
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={transition}
                        message="Invalid email ID! Please Try Again"
                        key={transition ? transition.name : ''}
                        className={classes.snackbar}
                    />
                    <AlertDialog
						open={openState}
						closeDialog={closeDialog}
						title="Reset Password Link"
						description='A reset password link has been sent on the given email address.\nPlease click on the link to set your new password.\nReset link is valid for 24 hrs' />
                </Grid>
            </Grid>
        </Container>
    );
}

export default ForgotPassword;
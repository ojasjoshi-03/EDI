import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useHistory, useParams } from 'react-router-dom';
import AlertDialog from "./AlertDialog";

//IMAGE
import lock from '../images/lock.svg';

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
        backgroundImage: `url(${lock})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: indigo[50],
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        height: '93vh',
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

const ResetPassword = () => {

    const { uidb64, token } = useParams();
    const history = useHistory();
    
    const [password, setPassword] = useState('');
    const [passworderror, setPassworderror] = useState(false);

	//Snackbar
	const [open, setOpen] = useState(false);
	const [transition, setTransition] = useState(undefined);

	//AlertDialog
	const [openState, setOpenState] = useState(false);
	const openDialog = () => setOpenState(true);
	const closeDialog = () => { 
		setOpenState(false); 
		history.push('/login');
	}

    const handleChange = (e) => {
        setPassworderror(false)
        setPassword(e.target.value.trim())
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(password);

        // Validation
        let submit = true

        setPassworderror(false)

        if (password === "" || password.length < 6) {
            setPassworderror(true)
            submit = false
            console.log(submit)
            console.log(password)
        }


        if (submit) {
            axiosInstance
                .patch(`auth/password-reset-complete`, {
                    "password": password,
                    "token": token,
                    "uidb64": uidb64
                })
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    openDialog();
                })
                .catch(err => { 
					console.log(err)
					if (err.response.status === 401) {
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
                        <Box fontSize={25} fontWeight="fontWeightBold" pr={22}>
                            Enter your New Password
                        </Box>
                        <form className={classes.form}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                id="password"
                                label="Password"
                                type="password"
                                onChange={handleChange}
                                error={passworderror}
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
                        message="Reset Link has Expired! Please Try Again"
                        key={transition ? transition.name : ''}
                        className={classes.snackbar}
                    />
                    <AlertDialog
						open={openState}
						closeDialog={closeDialog}
						title="Password Changed Successfully"
						description='Your password has been reset successfully.\nPlease proceed to login' />
                </Grid>
            </Grid>
        </Container>
    );
}
 
export default ResetPassword;
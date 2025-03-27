import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useHistory } from 'react-router-dom';
import Copyright from './copyright'
import AlertDialog from "./AlertDialog";

//IMAGE
import study2 from '../images/study2.svg';

//MUI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import Typography from '@material-ui/core/Typography';
import indigo from '@material-ui/core/colors/indigo';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
	image: {
		backgroundImage: `url(${study2})`,
		backgroundRepeat: 'no-repeat',
		backgroundColor: indigo[100],
		backgroundSize: 'auto',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(10, 4),
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
	text: {
		color: indigo[900],
		opacity: 1,
		paddingTop: 30,
		paddingLeft: 30,
		display: "flex",
		alignItems: "center",
	},
}));

function TransitionLeft(props) {
	return <Slide {...props} direction="left" />;
}

export default function Register() {

	const history = useHistory();
	const initialFormData = Object.freeze({
		email: '',
		name: '',
		password: '',
		user_type: '',
	});

	const [formData, updateFormData] = useState(initialFormData);
	const [emailerror, setEmailerror] = useState(false);
	const [nameerror, setNameerror] = useState(false);
	const [passerror, setPasserror] = useState(false);
	const [typeerror, setTypeerror] = useState(false);

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

		setEmailerror(false)
		setNameerror(false)
		setPasserror(false)
		setTypeerror(false)

		updateFormData({
			...formData,
			// Trimming any whitespace
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
		setNameerror(false)
		setPasserror(false)
		setTypeerror(false)

		if (formData.email === "" || !re.test(formData.email)) {
			setEmailerror(true)
			submit = false
			console.log(submit)
			console.log(formData.email)
		}
		if (formData.name === "" || formData.name.length < 3 || formData.name.length > 19 || /\d/.test(formData.name)) {
			setNameerror(true)
			submit = false
			console.log(submit)
			console.log(formData.name)
		}
		if (formData.password === "" || formData.password.length < 6) {
			setPasserror(true)
			submit = false
			console.log(submit)
			console.log(formData.password)
		}
		if (formData.user_type === "") {
			setTypeerror(true)
			submit = false
			console.log(submit)
			console.log(formData.user_type)
		}

		
		if (submit) {
			axiosInstance
				.post(`auth/register`, {
					"email": formData.email,
					"name": formData.name,
					"password": formData.password,
					"user_type": formData.user_type,
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
		<>
			<Grid container component="main" className={classes.root}>
				<CssBaseline />
				<Grid item xs={12} sm={4} md={7} className={classes.image}>
					<Typography variant="h3" gutterBottom className={classes.text} align="left">
						<Box lineHeight={1.3} fontWeight="fontWeightLight" m={1}>
							Where Teaching <br />and Learning<br /> come Together
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<div className={classes.paper}>
						<Avatar className={classes.avatar}>
							<PersonOutlineOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Sign Up
						</Typography>
						<form className={classes.form}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="email"
										label="Email Address"
										type="email"
										name="email"
										autoComplete="email"
										onChange={handleChange}
										error={emailerror}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="Name"
										label="Name"
										name="name"
										autoComplete="name"
										onChange={handleChange}
										error={nameerror}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
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
								</Grid>
								<Grid item xs={12}>
									<FormControl variant="outlined" fullWidth>
										<InputLabel id="select-label">User Type</InputLabel>
										<Select
											name="user_type"
											labelId="select-label"
											id="select"
											value={formData.user_type}
											label="User Type"
											required
											onChange={handleChange}
											error={typeerror}
										>
											<MenuItem value={'student'}>Student</MenuItem>
											<MenuItem value={'teacher'}>Teacher</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={handleSubmit}
							>
								Sign Up
							</Button>
							<Grid container justify="flex-end">
								<Grid item>
									<Link href="/login" variant="body2">
										Already have an account? Sign in
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
						message="Invalid Registration Data! Please Try Again"
						key={transition ? transition.name : ''}
					/>
					<AlertDialog
						open={openState}
						closeDialog={closeDialog}
						title="Verify Email"
						description='An email verification link has been sent on the given email address.\nPlease verify your email to complete the account setup.\nVerification link is valid for 24 hrs' />
				</Grid>
			</Grid>
		</>
	);
}
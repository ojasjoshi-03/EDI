import React, { useState } from 'react';

//MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles, Snackbar, TextField } from '@material-ui/core';
import axiosInstance from '../../../axios';


const useStyles = makeStyles((theme) => ({
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


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

export default function AddMember(props) {

    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');


    //Snackbar
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);


    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(email);

        // Validation
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let submit = true

        setError(false)

        if (email === "" || !re.test(email)) {
            setError(true)
            submit = false
            console.log(submit)
        }

        if (submit) {
            axiosInstance
                .post(`class/manage-student`, {
                    "class_id": props.classId,
                    "email": email,
                })
                .then((res) => {
                    console.log(res);
                    window.location.reload();
                })
                .catch(err => {
                    console.log({err})
                    if (err.response.status === 400 && err.response.data.response === 'Invalid student email') {
                        setMessage('Student does not exist. Please Try Again');
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
        <div>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={props.closeDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title" style={{ paddingBottom: 0 }}>{props.title}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        id="email"
                        onChange={(e) => { setEmail(e.target.value) }}
                        error={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                        ADD
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={open}
                onClose={handleClose}
                TransitionComponent={transition}
                message={message}
                key={transition ? transition.name : ''}
                className={classes.snackbar}
            />
        </div>
    );
}
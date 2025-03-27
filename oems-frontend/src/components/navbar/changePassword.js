import React, { useState } from 'react';

//MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles, Snackbar, TextField } from '@material-ui/core';
import axiosInstance from '../../axios';


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

export default function ChangePassword(props) {

    const initialFormData = Object.freeze({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [formData, updateFormData] = useState(initialFormData);
    const [passerror, setPasserror] = useState(false);

    //Snackbar
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);
    

    const handleChange = (e) => {

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

        let submit = true
        setPasserror(false)

        if (formData.new_password === "" || formData.new_password.length < 6 || formData.confirm_password !== formData.new_password) {
            setPasserror(true)
            submit = false
            console.log(submit)
            console.log(formData.old_password)
            console.log(formData.new_password)
            console.log(formData.confirm_password)
        }

        if (submit) {
            axiosInstance
                .patch(`auth/change-password`, {
                    "old_password": formData.old_password,
                    "new_password": formData.new_password,
                    "confirm_password": formData.confirm_password,
                })
                .then((res) => {
                    console.log({res});
                    props.closeDialog();
                })
                .catch(err => {
                    console.log(err)
                    console.log({err})
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
        <div>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={props.closeDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="old_password"
                            label="Old Password"
                            type="password"
                            id="old_password"
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="new_password"
                            label="New Password"
                            type="password"
                            id="new_password"
                            onChange={handleChange}
                            error={passerror}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirm_password"
                            label="Confirm New Password"
                            type="password"
                            id="confirm_password"
                            onChange={handleChange}
                            error={passerror}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                        CHANGE
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={open}
                onClose={handleClose}
                TransitionComponent={transition}
                message="Old password is incorrect. Please Try Again"
                key={transition ? transition.name : ''}
                className={classes.snackbar}
            />
        </div>
    );
}
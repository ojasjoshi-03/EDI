import React, { useState } from 'react';
import 'date-fns';
import { format } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import { useRecoilValue } from 'recoil';
import { userData } from '../../atoms';
import AlertDialog from "../AlertDialog";

//MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles, Snackbar, TextField } from '@material-ui/core';
import axiosInstance from '../../axios';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';


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

export default function CreateClass(props) {

    const user = useRecoilValue(userData);
    const [classname, setClassname] = useState('');
    const [classerror, setClasserror] = useState(false);
    const [message, setMessage] = useState('');

    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    //AlertDialog
    const [openState, setOpenState] = useState(false);
    const openDialog = () => setOpenState(true);
    const closeDialog = () => {
        setOpenState(false);
        window.location.reload();
    }

    //Snackbar
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);


    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(classname);
        console.log(selectedDate);

        // Validation

        let submit = true
        setClasserror(false)

        if (classname === "") {
            setClasserror(true)
            submit = false
            console.log(submit)
            console.log(classname)
        }

        if (submit) {
            axiosInstance
                .post(`class/manage-class`, {
                    "teacher_id": user.id,
                    "joining_code": Date.now(),
                    "name": classname,
                    "joining_code_expiry_date": format(selectedDate, 'yyyy-MM-dd'),
                })
                .then((res) => {
                    console.log(res);
                    let msg = "Joining Code: " + (res.data.joining_code).toString()
                    setMessage(msg);
                    props.closeDialog();
                    openDialog();
                })
                .catch(err => {
                    console.log(err)
                    console.log({ err })
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
                <DialogTitle id="alert-dialog-slide-title" style={{ paddingBottom: 0 }}>{props.title}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="class_name"
                        label="Class Name"
                        id="class_name"
                        onChange={(e) => { setClassname(e.target.value) }}
                        error={classerror}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            required
                            fullWidth
                            // variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Joining Code Expiry Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                        CREATE
                    </Button>
                </DialogActions>
            </Dialog>

            <AlertDialog
                open={openState}
                closeDialog={closeDialog}
                title={message}
                description="Copy and share the above joining code to your students to join the class"
            />

            <Snackbar
                open={open}
                onClose={handleClose}
                TransitionComponent={transition}
                message="An error occurred. Please Try Again"
                key={transition ? transition.name : ''}
                className={classes.snackbar}
            />
        </div>
    );
}
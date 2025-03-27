import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentClassId, currentQuizId } from '../../../atoms';
import axiosInstance from '../../../axios';
import 'date-fns';
import { format } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns';

//MUI
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import MakeQuestions from './makeQuestions';


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

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

export default function MakeQuiz() {

    const initialFormData = Object.freeze({
        name: '',
        number_of_questions: '',
        marks: '',
    });

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [formData, updateFormData] = useState(initialFormData);

    const setQuizId = useSetRecoilState(currentQuizId)
    const classId = useRecoilValue(currentClassId);

    const [nameError, setNameError] = useState(false);
    const [quesError, setQuesError] = useState(false);
    const [marksError, setMarksError] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [qnum, setQnum] = useState(0);


    //Snackbar
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);


    const handleChange = (e) => {

        setNameError(false)
        setQuesError(false)
        setMarksError(false)

        updateFormData({
            ...formData,
            // Trimming any whitespace
            [e.target.name]: e.target.value.trim(),
        });
    };


    const handleStartTime = (date) => {
        setStartTime(date);
    };

    const handleEndTime = (date) => {
        setEndTime(date);
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(formData);

        // Validation

        let submit = true
        setNameError(false)
        setQuesError(false)
        setMarksError(false)


        if (formData.name === "") {
            setNameError(true)
            submit = false
            console.log(submit)
        }

        if (formData.number_of_questions === "" || isNaN(formData.number_of_questions)) {
            setQuesError(true)
            submit = false
            console.log(submit)
        }

        if (formData.marks === "" || isNaN(formData.marks)) {
            setMarksError(true)
            submit = false
            console.log(submit)
        }

        console.log({
            "name": formData.name,
            "class_id": classId,
            "number_of_questions": formData.number_of_questions,
            "marks": formData.marks,
            "start_time": startTime,
            "end_time": endTime,
        });

        if (submit) {
            axiosInstance
                .post(`quiz/make-quiz`, {
                    "name": formData.name,
                    "class_id": classId,
                    "number_of_questions": formData.number_of_questions,
                    "marks": formData.marks,
                    "start_time": format(startTime, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSxxx"),
                    "end_time": format(endTime, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSxxx"),
                })
                .then((res) => {
                    console.log(res);
                    setQuizId(res.data.id);
                    setQnum(res.data.number_of_questions);
                    setDisabled(true);
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
        <Grid container>
            <Grid item xs={12} sm={8} md={6}>
                <Typography variant="h5" style={{ paddingBottom: 0 }}>
                    Create Quiz:
                </Typography>
                <TextField
                    margin="normal"
                    variant="outlined"
                    required
                    fullWidth
                    name="name"
                    label="Quiz Name"
                    id="name"
                    onChange={handleChange}
                    error={nameError}
                />
                <TextField
                    margin="normal"
                    variant="outlined"
                    required
                    fullWidth
                    name="number_of_questions"
                    label="Number of Questions"
                    id="number_of_questions"
                    onChange={handleChange}
                    error={quesError}
                />
                <TextField
                    margin="normal"
                    variant="outlined"
                    required
                    fullWidth
                    name="marks"
                    label="Marks"
                    id="marks"
                    onChange={handleChange}
                    error={marksError}
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        required
                        fullWidth
                        margin="normal"
                        id="start_time"
                        label="Start Time"
                        value={startTime}
                        onChange={handleStartTime}
                        KeyboardButtonProps={{
                            'aria-label': 'change start_time',
                        }}
                    />
                    <DateTimePicker
                        required
                        fullWidth
                        margin="normal"
                        id="end_time"
                        label="End Time"
                        value={endTime}
                        onChange={handleEndTime}
                        KeyboardButtonProps={{
                            'aria-label': 'change end_time',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <Button type="submit" onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: "16px" }} disabled={disabled}>
                    CREATE
                </Button>
            </Grid>
            {disabled &&
                <Grid container>
                    <Grid item xs={12} sm={8} md={6}>
                        <Divider style={{ marginTop: "24px" }} />
                        <MakeQuestions qnum={qnum} />
                    </Grid>
                </Grid>
            }
            <Snackbar
                open={open}
                onClose={handleClose}
                TransitionComponent={transition}
                message="Invalid Data, Please try again."
                key={transition ? transition.name : ''}
                className={classes.snackbar}
            />
        </Grid>
    );
}
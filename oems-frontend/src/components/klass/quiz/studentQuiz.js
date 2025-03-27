import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../axios'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userData, quizDrawerId, currentQuizId } from '../../../atoms';
import { format } from 'date-fns';

// MUI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(2, 0, 2),
    },
    snackbar: {
        paddingBottom: theme.spacing(3),
    },
}));

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

const StudentQuiz = () => {

    const [quiz, setQuiz] = useState(null);
    const [quizResponse, setQuizResponse] = useState([]);
    const [len, setLen] = useState(0);

    const user = useRecoilValue(userData)
    const quizId = useRecoilValue(currentQuizId)
    const setDrawerId = useSetRecoilState(quizDrawerId)


    //Snackbar
    const [open, setOpen] = useState(false);
    const [transition, setTransition] = useState(undefined);


    const check = (response) => {
        let c = 0;
        response = response.filter(function (el) {
            return el != null;
        });
        // eslint-disable-next-line
        response.map((m) => {
            if (m === undefined || m === null) {
                c++;
            }
            else if ((m && m.question_id === "") || (m && m.marked_option_number === "")) {
                c++;
            }
        })
        console.log(c);
        console.log(response.length + " " + len);
        if (c === 0 && response.length === len)
            return true;
        else
            return false;
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        console.log(quizResponse);
        let submit = true;

        submit = check(quizResponse);
        console.log(submit);

        if (submit) {
            axiosInstance
                .post(`quiz/response/${quizId}/${user.id}`, quizResponse)
                .then((res) => {
                    console.log(res);
                    setDrawerId(1);
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
        else {
            setTransition(() => TransitionLeft);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e, key, quiz_id) => {
        let newQuizResp = [...quizResponse]
        newQuizResp[key] = { "question_id": quiz_id, "marked_option_number": parseInt(e.target.value) }
        setQuizResponse(newQuizResp);
    };


    const classes = useStyles();

    useEffect(() => {
        axiosInstance
            .get(`quiz/question/${quizId}/${user.id}`)
            .then((res) => {
                console.log(res);
                setQuiz(res.data);
                if (res.data.quiz_status && res.data.quiz_status === 'Active') {
                    setLen(res.data.questions.length);
                }
            })
            .catch(err => {
                console.log(err)
            });
        // eslint-disable-next-line
    }, [])


    return (
        <>
            <Box>
                <Typography variant="h6" className={classes.title} gutterBottom>
                    {quiz && quiz.name} {" "}
                    {quiz && quiz.quiz_response && quiz.quiz_response.length > 0 ?
                        <Typography variant="h6" component="span" gutterBottom>
                            Response:
                        </Typography>
                        :
                        null
                    }
                    {quiz && quiz.quiz_status && quiz.quiz_status === 'Active' ?
                        <>
                            <Typography variant="body1" gutterBottom>
                                {`Quiz will end on: ${format(new Date(quiz.end_time), "MMM dd, yyyy, 'at' HH:mm")}`}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Total Marks: {quiz && quiz.marks}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Attempting all questions are mandatory. Response is not auto-saved and will only be accepted on clicking submit.
                            </Typography>
                        </>
                        :
                        null
                    }
                    {quiz && quiz.quiz_response && quiz.quiz_response.length > 0 ?
                        <Typography variant="subtitle1" gutterBottom>
                            Total Marks Scored: {quiz.marks_scored}/{quiz.total_marks}
                        </Typography>
                        :
                        null
                    }
                </Typography>

                <Divider style={{ marginBottom: "24px" }} />

                <Typography variant="body1" display="block" gutterBottom>
                    {quiz && quiz.response && quiz.response.substr(0, 18) === 'Quiz will start on'
                        ?
                        `Quiz will start on ${format(new Date(quiz.start_time), "MMM dd, yyyy, 'at' HH:mm")}`
                        :
                        quiz && quiz.response
                    }
                </Typography>

                <Box mb={4}>
                    {quiz && quiz.quiz_response && quiz.quiz_response.length > 0 ?
                        quiz.quiz_response.map((q, key) => (
                            <Paper elevation={3} style={{ backgroundColor: "#e1f5fe" }}>
                                <Box p={2} mt={3}>
                                    <Box style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="h6">
                                            {"Question" + (key + 1)}
                                        </Typography>
                                        <Typography variant="h6">
                                            {q.marks_scored}/{q.marks} {q.marks_scored > 1 ? <>marks</> : <>mark</>}
                                        </Typography>
                                    </Box>
                                    <Typography>
                                        {q.question}
                                    </Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup aria-label={"options" + q.id} name={"Question" + (key + 1)} value={q.marked_option_number}>
                                            <FormControlLabel value={1} control={<Radio />} label={q.option1} />
                                            <FormControlLabel value={2} control={<Radio />} label={q.option2} />
                                            <FormControlLabel value={3} control={<Radio />} label={q.option3} />
                                            <FormControlLabel value={4} control={<Radio />} label={q.option4} />
                                        </RadioGroup>
                                    </FormControl>
                                    <Box mt={2}>
                                        <strong>Correct Option Number: {q.correct_option_number} </strong>
                                    </Box>
                                </Box>
                            </Paper>
                        ))
                        :
                        null
                    }
                </Box>

                <Box>
                    {quiz && quiz.quiz_status && quiz.quiz_status === 'Active' ?
                        <>
                            {quiz.questions.map((q, key) => (
                                <Paper elevation={3} style={{ backgroundColor: "#e1f5fe" }} key={key}>
                                    <Box p={2} mt={3}>
                                        <Box style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="h6">
                                                {"Question" + (key + 1)}
                                            </Typography>
                                            <Typography variant="h6">
                                                {q.marks} marks
                                            </Typography>
                                        </Box>
                                        <Typography>
                                            {q.question}
                                        </Typography>
                                        <FormControl component="fieldset">
                                            <RadioGroup aria-label={"options" + q.id} name={"Question" + (key + 1)} value={quizResponse[key] && quizResponse[key].marked_option_number ? quizResponse[key].marked_option_number : 0} onChange={(e) => { handleChange(e, key, q.id) }}>
                                                <FormControlLabel value={1} control={<Radio />} label={q.option1} />
                                                <FormControlLabel value={2} control={<Radio />} label={q.option2} />
                                                <FormControlLabel value={3} control={<Radio />} label={q.option3} />
                                                <FormControlLabel value={4} control={<Radio />} label={q.option4} />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                </Paper>
                            ))}
                            <Button type="submit" onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: "16px", marginBottom: "24px" }}>
                                SUBMIT
                            </Button>
                        </>
                        :
                        null
                    }
                </Box>
            </Box>
            <Snackbar
                open={open}
                onClose={handleClose}
                TransitionComponent={transition}
                message="Please attempt all the questions"
                key={transition ? transition.name : ''}
                className={classes.snackbar}
            />
        </>
    );
}

export default StudentQuiz;
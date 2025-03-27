import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../axios'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { format } from 'date-fns';
import { quizDrawerId, currentQuizId } from '../../../atoms';

//MUI
import { Box, Divider, Paper, Typography } from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const QuizDetails = () => {

    const [quiz, setQuiz] = useState(null);
    const quizId = useRecoilValue(currentQuizId);
    const setDrawerId = useSetRecoilState(quizDrawerId)

    useEffect(() => {
        axiosInstance
            .get(`quiz/question/${quizId}`)
            .then((res) => {
                console.log(res);
                setQuiz(res.data)
            })
            .catch(err => {
                console.log(err)
            });

        return () => {
            setDrawerId(0);
            console.log("Cleaned up");
        };
        // eslint-disable-next-line
    }, [])

    return (
        <Box mb={4}>
            <Typography variant="h6">
                QUIZ DETAILS
            </Typography>
            <Divider style={{ marginTop: "16px", marginBottom: "16px" }} />
            <Box>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>NAME: </strong>{quiz && quiz.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>TOTAL MARKS: </strong> {quiz && quiz.marks}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>NUMBER OF QUESTIONS: </strong> {quiz && quiz.number_of_questions}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>STATUS: </strong>
                    {quiz && quiz.quiz_status && quiz.quiz_status.substr(0, 3) === "Due" ?
                        `Due on ${format(new Date(quiz.start_time), "MMM dd, yyyy, HH:mm")}`
                        :
                        quiz && quiz.quiz_status
                    }
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>START TIME: </strong>{quiz && format(new Date(quiz.start_time), "MMM dd, yyyy, HH:mm")}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>END TIME: </strong> {quiz && format(new Date(quiz.end_time), "MMM dd, yyyy, HH:mm")}
                </Typography>
                <Typography variant="subtitle1" gutterBottom style={{ marginTop: "24px" }} >
                    <strong>QUESTIONS: </strong>
                </Typography>
                <Divider />
            </Box>
            {quiz && quiz.questions.length > 0 ?
                quiz.questions.map((q, key) => (
                    <Paper elevation={3} style={{ backgroundColor: "#e1f5fe" }}>
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
                                <RadioGroup aria-label={"options" + q.id} name="gender1" value={q.correct_option_number}>
                                    <FormControlLabel value={1} control={<Radio />} label={q.option1} />
                                    <FormControlLabel value={2} control={<Radio />} label={q.option2} />
                                    <FormControlLabel value={3} control={<Radio />} label={q.option3} />
                                    <FormControlLabel value={4} control={<Radio />} label={q.option4} />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Paper>
                ))

                :

                <Typography variant="overline" display="block" gutterBottom>
                    No questions are there to show
                </Typography>
            }
        </Box>
    );
}

export default QuizDetails;
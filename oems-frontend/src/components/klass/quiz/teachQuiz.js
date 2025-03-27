import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../axios'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentClassId } from '../../../atoms';
import { format } from 'date-fns';
import { quizDrawerId, currentQuizId } from '../../../atoms';

// MUI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DoneAllTwoToneIcon from '@material-ui/icons/DoneAllTwoTone';
import AssignmentTwoToneIcon from '@material-ui/icons/AssignmentTwoTone';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
}));


const ClassMembers = () => {

    const [quiz, setQuiz] = useState(null);

    const setQuizId = useSetRecoilState(currentQuizId)
    const setDrawerId = useSetRecoilState(quizDrawerId)
    const classId = useRecoilValue(currentClassId);

    const classes = useStyles();

    useEffect(() => {
        axiosInstance
            .get(`quiz/${classId}`)
            .then((res) => {
                console.log(res);
                setQuiz(res.data)
            })
            .catch(err => {
                console.log(err)
            });
        // eslint-disable-next-line
    }, [])

    const handleClick = (quiz_id) => {
        setQuizId(quiz_id);
        setDrawerId(2);
    }


    const releaseResponse = (quiz_id) => {
        axiosInstance
            .post(`quiz/result/${quiz_id}`)
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <Container>
            <Box>
                <div className={classes.root}>
                    <Grid container spacing={2} direction="row" justify="center" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6" className={classes.title}>
                                QUIZ LIST
                            </Typography>
                            <Divider style={{ marginBottom: "10px" }} />
                            <div className={classes.demo}>
                                <List>
                                    {quiz && quiz.length > 0 ? quiz.map(q => (
                                        <Paper style={{ marginTop: "10px", backgroundColor: "#e1f5fe" }}>
                                            <ListItem button onClick={() => handleClick(q.id)}>
                                                <ListItemAvatar>
                                                    <Avatar style={{ backgroundColor: "white" }}>
                                                        <AssignmentTwoToneIcon color="primary" style={{ fontSize: 26 }} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={q.name}
                                                    secondary={
                                                        <>
                                                            <div>
                                                                <Typography component="span" variant="body2">
                                                                    Marks: {q.marks} | Questions: {q.number_of_questions}
                                                                </Typography>
                                                                <Typography variant="subtitle2">
                                                                    {q.quiz_status.substr(0, 3) === "Due" ?
                                                                        `Due on ${format(new Date(q.start_time), "MMM dd, yyyy, HH:mm")}`
                                                                        :
                                                                        q.quiz_status
                                                                    }
                                                                </Typography>
                                                            </div>
                                                        </>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    {q.response_released ?
                                                        <Tooltip title="Response already released" arrow>
                                                            <span>
                                                                <IconButton edge="end" aria-label="delete" disabled style={{ marginRight: "0px" }}>
                                                                    <DoneAllTwoToneIcon style={{ fontSize: 30 }} />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                        :
                                                        <Tooltip title="Release Response" arrow>
                                                            <IconButton edge="end" aria-label="delete" onClick={() => releaseResponse(q.id)} style={{ marginRight: "0px" }}>
                                                                <DoneAllTwoToneIcon color="primary" style={{ fontSize: 30 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </Paper>
                                    ))

                                        :

                                        <Typography variant="overline" display="block" gutterBottom>
                                            No quizzes available
                                        </Typography>
                                    }
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Box>
        </Container>
    );
}

export default ClassMembers;
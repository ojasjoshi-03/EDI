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
import Typography from '@material-ui/core/Typography';
import AssignmentTwoToneIcon from '@material-ui/icons/AssignmentTwoTone';
import Divider from '@material-ui/core/Divider';
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
        setDrawerId(4);
    }


    return (
        <Container>
            <Box>
                <div className={classes.root}>
                    <Grid container spacing={2} direction="row" justify="center" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6" className={classes.title}>
                                Select Quiz to get Statistics
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
                                                            </div>
                                                        </>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <Typography variant="subtitle2">
                                                        {q.quiz_status.substr(0, 3) === "Due" ?
                                                            `Due ${format(new Date(q.start_time), "MMM, dd")}`
                                                            :
                                                            q.quiz_status
                                                        }
                                                    </Typography>
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
import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../axios'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { quizDrawerId, currentClassId, currentQuizId } from '../../../atoms';
import { format } from 'date-fns';


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
import CircularProgress from '@material-ui/core/CircularProgress';
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
    circle: {
        strokeLinecap: "round",
    }
}));

function CircularProgressWithLabel(props) {
    return (
        <Box position="relative" display="inline-flex" >
            <CircularProgress variant="determinate" size={100} {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="body1" component="div" color="textSecondary">
                    {props.num}/{props.denom}
                </Typography>
            </Box>
        </Box>
    );
}


const QuizStatistics = () => {

    const quizId = useRecoilValue(currentQuizId);
    const classId = useRecoilValue(currentClassId);
    const setDrawerId = useSetRecoilState(quizDrawerId)

    const [stats, setStats] = useState(null);
    const [progress, setProgress] = useState(0);

    const classes = useStyles();


    useEffect(() => {
        axiosInstance
            .get(`quiz/statistics/${classId}/${quizId}`)
            .then((res) => {
                setProgress(res.data.students_submitted)
                setStats(res.data);
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
        return () => {
            setDrawerId(3);
            console.log("Cleaned up");
        };
        //eslint-disable-next-line
    }, [])
    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= progress ? progress : prevProgress + 1));
        }, 800);
        return () => {
            clearInterval(timer);
        };
        //eslint-disable-next-line
    }, []);

    return (
        <Container>
            <Box>
                <div className={classes.root}>
                    <Grid container spacing={2} direction="row" justify="center" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6" className={classes.title}>
                                Quiz Statistics
                            </Typography>
                            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
                            <Grid container alignItems="center" justify="center">

                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={3} style={{ padding: "24px", margin: "16px", backgroundColor: "#e8eaf6" }}>
                                        <Typography variant="subtitle2" style={{ marginBottom: "10px" }}>
                                            Status: {" "}
                                            {stats && stats.quiz_status && stats.quiz_status.substr(0, 3) === "Due" ?
                                                `Due on ${format(new Date(stats.start_time), "dd-MM-yyyy, HH:mm")}`
                                                :
                                                stats && stats.quiz_status
                                            }
                                        </Typography>
                                        <Typography variant="subtitle2" style={{ marginBottom: "10px" }}>
                                            Start Time: {stats && format(new Date(stats.start_time), " dd-MM-yyyy, HH:mm")}
                                        </Typography>
                                        <Typography variant="subtitle2" style={{ marginBottom: "10px" }}>
                                            End Time: {stats && format(new Date(stats.end_time), "dd-MM-yyyy, HH:mm")}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={3} style={{ padding: "24px", margin: "16px", backgroundColor: "#e8eaf6" }}>
                                        <Typography variant="subtitle2" style={{ marginBottom: "10px" }}>
                                            Number of questions: {stats && stats.number_of_questions}
                                        </Typography>
                                        <Typography variant="subtitle2" style={{ marginBottom: "10px" }}>
                                            Total Marks: {stats && stats.marks}
                                        </Typography>
                                        <Typography variant="subtitle2" style={{ marginBottom: "10px" }}>
                                            Response Released: {stats && stats.response_released ? "Yes" : "No"}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={3} style={{ padding: "24px", margin: "16px", backgroundColor: "#e8eaf6", textAlign: "center" }}>
                                        <Typography variant="subtitle2" style={{ marginBottom: "10px" }}>
                                            Submissions Received:
                                        </Typography>
                                        {stats && stats.students_submitted === 0 ?
                                            <CircularProgressWithLabel  color="#e0e0e0" classes={{ circle: classes.circle }} num={stats && stats.students_submitted} denom={stats && stats.total_students} value={100} />
                                            :
                                            <CircularProgressWithLabel classes={{ circle: classes.circle }} num={stats && stats.students_submitted} denom={stats && stats.total_students} value={((stats && stats.students_submitted) / (stats && stats.total_students)) * 100} />
                                        }
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
                            <div className={classes.demo}>
                                <List>
                                    <Typography variant="subtitle2">
                                        Student Submissions:
                                    </Typography>
                                    {stats && stats.quiz_submission_status.length > 0 && stats.quiz_submission_status.map(m => (
                                        <Paper style={{ marginTop: "10px", backgroundColor: "#e1f5fe" }}>
                                            <ListItem key={m.id}>
                                                <ListItemAvatar>
                                                    <Avatar alt="avatar" src={`http://127.0.0.1:8000${m.profile_picture}`} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={m.name.toUpperCase()}
                                                    secondary={
                                                        <>
                                                            <Typography variant="subtitle2">
                                                                {m.email}
                                                            </Typography>
                                                            <Typography component="span" variant="body2">
                                                                Submitted Quiz: {m.submission_status ? "Yes" : "No"}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    {m.marks_scored}/{stats.marks}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </Paper>
                                    ))}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Box>
        </Container>
    );
}

export default QuizStatistics;
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../axios';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { assignmentTeacherDrawerId, currentResponseId, currentAssignmentId } from '../../../../atoms';
import { format } from 'date-fns';

//MUI
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AssignmentTwoToneIcon from '@material-ui/icons/AssignmentTwoTone';

const useStyles = makeStyles((theme) => ({
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        marginTop: 10,
    },
}));

const ResponsesList = () => {
    const classes = useStyles();
    const dense = false;
    const setIndex = useSetRecoilState(assignmentTeacherDrawerId);
    const assignmentId = useRecoilValue(currentAssignmentId);
    const setResponseId = useSetRecoilState(currentResponseId);
    const [submitted, setSubmitted] = useState([]);
    const [notSubmitted, setNotSubmitted] = useState([]);

    //get response list
    function getResponseList() {
        axiosInstance.get(`assignment/${assignmentId}/response-list`)
            .then((res) => {
                setSubmitted(res.data["Submitted_Responses"]);
                setNotSubmitted(res.data["Not_Submitted_Responses"]);
                console.log(res.data);
            })
    }

    useEffect(() => {
        getResponseList()
        // eslint-disable-next-line
    }, [])

    //set response and index

    function handleClick(id) {
        setResponseId(id);
        setIndex(3);
    }


    return (
        <div>
            <div>
                <Box m={0} p={1}>
                    <Grid container spacing={1} direction="row" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6">
                                Submitted Responses
                            </Typography>
                            <Divider style={{ marginBottom: "10px" }} />
                            <div className={classes.demo}>
                                <List dense={dense}>
                                    {submitted.length > 0 ? submitted.map(s => (
                                        <div key={s.id}>
                                            <Paper style={{ marginTop: "10px", backgroundColor: "#e1f5fe" }} onClick={() => handleClick(s.id)}>
                                                <ListItem button>
                                                    <ListItemAvatar>
                                                        <Avatar style={{ backgroundColor: "white" }}>
                                                            <AssignmentTwoToneIcon color="primary" style={{ fontSize: 26 }} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={s.name}
                                                        // red if past due
                                                        secondary={s.submited_date && `Submitted on ${format(new Date(s.submited_date), "MMM dd, yyyy, HH:mm")}`}
                                                    />
                                                </ListItem>
                                            </Paper>
                                        </div>
                                    ))
                                        :
                                        <Typography variant="overline" display="block" gutterBottom>
                                            No submitted Responses
                                        </Typography>
                                    }
                                </List>
                            </div>
                            <Typography>
                                Graded assignments are moved to the graded section
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={3} p={1}>
                    <Grid container spacing={1} direction="row" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6">
                                Awaiting responses from the following students:
                            </Typography>
                            <Divider style={{ marginBottom: "10px" }} />
                            <div className={classes.demo}>
                                <List dense={dense}>
                                    {notSubmitted.map(s => (
                                        <div key={s.email}>
                                            <Paper style={{ marginTop: "10px", backgroundColor: "#e1f5fe", maxWidth: "650px" }}>
                                                <ListItem>
                                                    <ListItemText
                                                        primary={s.name.toUpperCase()}
                                                        secondary={s.email}
                                                    />
                                                </ListItem>
                                            </Paper>
                                        </div>
                                    ))}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    );
}

export default ResponsesList;
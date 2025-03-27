import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../axios';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { assignmentTeacherDrawerId, currentResponseId, currentAssignmentId } from '../../../../atoms';


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

const GradedList = () => {
    const classes = useStyles();
    const dense = false;
    const setIndex = useSetRecoilState(assignmentTeacherDrawerId);
    const assignmentId = useRecoilValue(currentAssignmentId);
    const setResponseId = useSetRecoilState(currentResponseId);
    const [list, setList] = useState([]);

    //get graded response list
    function getGradedResponseList() {
        axiosInstance.get(`assignment/${assignmentId}/graded-response-list`)
            .then((res) => {
                setList(res.data);
                console.log(res.data);
            })
    }

    useEffect(() => {
        getGradedResponseList()
        // eslint-disable-next-line
    }, [])

    //set index and response
    function handleClick(id) {
        setResponseId(id);
        setIndex(5);
    }

    return (
        <div>
            <div>
                <Box m={0} p={1}>
                    <Grid container spacing={1} direction="row" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6">
                                Graded Responses
                            </Typography>
                            <Divider style={{ marginBottom: "10px" }} />
                            <div className={classes.demo}>
                                <List dense={dense}>
                                    {list.length > 0 ? list.map(s => (
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
                                                        secondary={`marks:${s.marks}`}
                                                    />
                                                </ListItem>
                                            </Paper>
                                        </div>

                                    ))
                                        :
                                        <Typography variant="overline" display="block" gutterBottom>
                                            No Graded Responses
                                        </Typography>

                                    }
                                </List>
                            </div>
                        </Grid>
                    </Grid>

                </Box>
            </div>
        </div>
    );
}

export default GradedList;
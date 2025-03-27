import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../axios';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { assignmentStudentDrawerId, userData, currentClassId, currentAssignmentId } from '../../../../atoms';
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
        width: 500,
    },
}));

const Assigned = () => {
    const classes = useStyles();
    const dense = false;
    const setIndex = useSetRecoilState(assignmentStudentDrawerId);
    const setAssignmentId = useSetRecoilState(currentAssignmentId);
    const classId = useRecoilValue(currentClassId);
    const user = useRecoilValue(userData);
    const studentId = user.id;
    const [list, setList] = useState([]);


    //get assignment
    function getAssignedAssignemnt() {
        axiosInstance.get(`assignment/${studentId}/${classId}/list`)
            .then((res) => {
                setList(res.data['Pending']);
                console.log(res.data);
            })
    }

    //set assignment and index
    function handleClick(id) {
        setAssignmentId(id);
        setIndex(2);
    }

    useEffect(() => {
        getAssignedAssignemnt()
        // eslint-disable-next-line
    }, [])


    return (
        <div>
            <div>
                <Box m={0} p={1}>
                    <Grid container spacing={1} direction="row" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6">
                                Assigned Assignments
                            </Typography>
                            <Divider style={{ marginBottom: "10px" }} />
                            <div className={classes.demo}>
                                <List dense={dense}>
                                    {list.length > 0 ? list.map(l => (
                                        <div key={l.id}>
                                            <Paper style={{ marginTop: "10px", backgroundColor: "#e1f5fe" }} onClick={() => handleClick(l.id)}>
                                                <ListItem button>
                                                    <ListItemAvatar>
                                                        <Avatar style={{ backgroundColor: "white" }}>
                                                            <AssignmentTwoToneIcon color="primary" style={{ fontSize: 26 }} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={l.name}
                                                        secondary={
                                                            <>
                                                                {(new Date()) < (new Date(l.due_on)) ?
                                                                    <Typography>
                                                                        {l.due_on && `Due on ${format(new Date(l.due_on), "MMM dd, yyyy, HH:mm")}`}
                                                                    </Typography>
                                                                    :
                                                                    <Typography style={{ color: "#e53935" }}>
                                                                        {l.due_on && `Due on ${format(new Date(l.due_on), "MMM dd, yyyy, HH:mm")}`}
                                                                    </Typography>
                                                                }
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                            </Paper>
                                        </div>
                                    )) :
                                        <Typography variant="overline" display="block" gutterBottom>
                                            No Assigned Assignments
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

export default Assigned;
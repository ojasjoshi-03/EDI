import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userData, assignmentStudentDrawerId, assignmentTeacherDrawerId } from '../../../atoms';
import AssignmentDetails from './student/assignmentDetails';
import Assigned from './student/assigned';
import Completed from './student/completed';
import Grade from './student/grade';
import AssignmentList from './teacher/assignmentList';
import TeacherAssignment from './teacher/teacherAssignment';

//MUI
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
// import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
// import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Paper from '@material-ui/core/Paper';



const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        height: "100vh",
        whiteSpace: 'nowrap',
        "& .MuiDrawer-paper": {
            position: "static",
        }
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3, 3, 0, 3)
    },
    content1: {
        flexGrow: 1,
        padding: theme.spacing(0, 3, 0, 0)
    },
    control: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
}));

function renderSwitch(index, user_type) {
    if (user_type === 'student') {
        switch (index) {
            case 0:
                return <Assigned />;
            case 1:
                return <Completed />
            case 2:
                return <AssignmentDetails />
            case 3:
                return <Grade />
            default:
                return <Assigned />
        }
    }
    else {
        switch (index) {
            case 0:
                return <AssignmentList />
            default:
                return <TeacherAssignment />
        }
    }
}

export default function Assignment() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    //index and user_type
    const [index, setIndex] = useRecoilState(assignmentStudentDrawerId);
    const user = useRecoilValue(userData);
    const tindex = useRecoilValue(assignmentTeacherDrawerId);

    useEffect(() => {
        return () => {
            setIndex(0);
            console.log("Cleaned up");
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {user.user_type === 'student'
                ?
                (
                    <div className={classes.root}>
                        <Paper elevation={3}>
                            <Drawer
                                variant="permanent"
                                className={clsx(classes.drawer, {
                                    [classes.drawerOpen]: open,
                                    [classes.drawerClose]: !open
                                })}
                                classes={{
                                    paper: clsx({
                                        [classes.drawerOpen]: open,
                                        [classes.drawerClose]: !open
                                    })
                                }}
                            >
                                <div className={classes.control}>
                                    {open ?
                                        <IconButton onClick={handleDrawerClose}>
                                            <ChevronLeftIcon />
                                        </IconButton>
                                        :
                                        <IconButton onClick={handleDrawerOpen}>
                                            <ChevronRightIcon />
                                        </IconButton>}
                                </div>
                                <Divider />
                                <List>
                                    <ListItem button onClick={() => setIndex(0)}>
                                        <ListItemIcon>
                                            <AssignmentIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Assigned" />
                                    </ListItem>
                                    <ListItem button onClick={() => setIndex(1)}>
                                        <ListItemIcon>
                                            <AssignmentTurnedInIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Completed" />
                                    </ListItem>
                                </List>
                            </Drawer>
                        </Paper>
                        <main className={classes.content}>
                            {renderSwitch(index, user.user_type)}
                        </main>
                    </div>
                )
                :
                (
                    <div className={classes.content1}>
                        {renderSwitch(tindex, user.user_type)}
                    </div>
                )
            }
        </div>
    );
}

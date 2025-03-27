import React, { useState } from 'react';
import clsx from 'clsx';
import { useRecoilState } from 'recoil';
import { assignmentTeacherDrawerId } from '../../../../atoms';
import TeacherAssignmentDetails from './teacherAssignmentDetails';
import ResponsesList from './responsesList';
import ResponseDetails from './responseDetails';
import GradedList from './gradedList';
import GradedDetails from './gradedDetails';

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
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Paper from '@material-ui/core/Paper';
import { useEffect } from 'react';



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
    control: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
}));

function renderSwitch(index) {
    switch (index) {
        case 1:
            return <TeacherAssignmentDetails />
        case 2:
            return <ResponsesList />
        case 3:
            return <ResponseDetails />
        case 4:
            return <GradedList />
        case 5:
            return <GradedDetails />
        default:
            return <TeacherAssignmentDetails />
    }
}

export default function TeacherAssignment() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    //index and user_type
    const [index, setIndex] = useRecoilState(assignmentTeacherDrawerId);


    useEffect(() => {
        return () => {
            setIndex(0);
            console.log("Cleaned up");
        };
        // eslint-disable-next-line
    }, []);

    return (
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
                        <ListItem button onClick={() => setIndex(1)}>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Details" />
                        </ListItem>
                        <ListItem button onClick={() => setIndex(2)}>
                            <ListItemIcon>
                                <AssignmentLateIcon />
                            </ListItemIcon>
                            <ListItemText primary="Responses" />
                        </ListItem>
                        <ListItem button onClick={() => setIndex(4)}>
                            <ListItemIcon>
                                <AssignmentTurnedInIcon />
                            </ListItemIcon>
                            <ListItemText primary="Graded" />
                        </ListItem>
                    </List>
                </Drawer>
            </Paper>
            <main className={classes.content}>
                {renderSwitch(index)}
            </main>
        </div>
    );
}

import React from 'react'
import { useRecoilValue, useRecoilState } from 'recoil';
import { userData, quizDrawerId } from '../../../atoms';

import MakeQuiz from './makeQuiz';
import TeachQuiz from './teachQuiz';
import QuizDetails from './quizDetails';
import Statistics from './statistics'
import QuizStatistics from './quizStatistics';

import CompletedStuQuiz from './completedStuQuiz';
import PendingStuQuiz from './pendingStuQuiz';
import StudentQuiz from './studentQuiz';

//MUI
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PostAddIcon from '@material-ui/icons/PostAdd';
import EqualizerIcon from '@material-ui/icons/Equalizer';
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
    control: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
}));

const RenderSwitch = ({ id, type }) => {
    console.log(id + ' ' + type);
    if (type === "student") {
        switch (id) {
            case 0:
                return <PendingStuQuiz />;
            case 1:
                return <CompletedStuQuiz />;
            case 2:
                return <StudentQuiz />;
            default:
                return <PendingStuQuiz />;
        }
    }
    else {
        switch (id) {
            case 0:
                return <TeachQuiz />;
            case 1:
                return <MakeQuiz />;
            case 2:
                return <QuizDetails />;
            case 3:
                return <Statistics />;
            case 4:
                return <QuizStatistics />;
            default:
                return <TeachQuiz />;
        }
    }
}

export default function Quiz() {

    const user = useRecoilValue(userData);
    const [drawerId, setDrawerId] = useRecoilState(quizDrawerId);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

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

                    {user.user_type === "student" ?
                        <List>
                            <ListItem button onClick={() => setDrawerId(0)}>
                                <ListItemIcon>
                                    <AssignmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Pending" />
                            </ListItem>
                            <ListItem button onClick={() => setDrawerId(1)}>
                                <ListItemIcon>
                                    <AssignmentTurnedInIcon />
                                </ListItemIcon>
                                <ListItemText primary="Completed" />
                            </ListItem>
                        </List>

                        :

                        <List>
                            <ListItem button onClick={() => setDrawerId(0)}>
                                <ListItemIcon>
                                    <AssignmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Quizzes" />
                            </ListItem>
                            <ListItem button onClick={() => setDrawerId(1)}>
                                <ListItemIcon>
                                    <PostAddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Make Quiz" />
                            </ListItem>
                            <ListItem button onClick={() => setDrawerId(3)}>
                                <ListItemIcon>
                                    <EqualizerIcon />
                                </ListItemIcon>
                                <ListItemText primary="Statistics" />
                            </ListItem>
                        </List>
                    }
                    <Divider />
                </Drawer>
            </Paper>
            <main className={classes.content}>
                <RenderSwitch id={drawerId} type={user.user_type} />
            </main>
        </div>
    );
}

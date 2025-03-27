import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../axios'
import { useRecoilValue } from 'recoil';
import { userData, currentClassId } from '../../../atoms';
import AddMember from './addMember';

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
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Divider } from '@material-ui/core';

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

    const [members, setMembers] = useState(null);
    const user = useRecoilValue(userData);
    const classId = useRecoilValue(currentClassId);
    const classes = useStyles();

    //Add Student Dialog
    const [open, setOpen] = useState(false);
    const openAddDialog = () => setOpen(true);
    const closeAddDialog = () => {
        setOpen(false);
    }

    useEffect(() => {
        axiosInstance
            .get(`class/class-list/${classId}`)
            .then((res) => {
                console.log(res);
                setMembers(res.data)
            })
            .catch(err => {
                console.log(err)
            });
        // eslint-disable-next-line
    }, [])


    const removeStudent = (stu_id) => {
        axiosInstance
            .delete(`class/manage-student`, {
                data: {
                    "class_id": classId,
                    "student_id": stu_id,
                }
            })
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <Container style={{padding: "24px"}}>
            <Box>
                <div className={classes.root}>
                    <Grid container spacing={2} direction="row" justify="center" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6" className={classes.title}>
                                Class Members
                                {user.user_type === "teacher" &&
                                    <IconButton edge="end" aria-label="add" style={{ marginLeft: "10px" }} onClick={openAddDialog} >
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                }
                            </Typography>
                            <Divider style={{ marginBottom: "10px" }} />
                            <div className={classes.demo}>
                                <List>
                                    <Typography variant="subtitle2">
                                        Teacher
                                    </Typography>
                                    {members && members.teacher[0] &&
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar alt="avatar" src={`http://127.0.0.1:8000${members.teacher[0].profile_picture}`} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={members.teacher[0].name}
                                                secondary={members.teacher[0].email}
                                            />
                                        </ListItem>
                                    }
                                    <Typography variant="subtitle2">
                                        Students
                                    </Typography>
                                    {members && members.students.length > 0 && members.students.map(m => (
                                        <ListItem key={m.id}>
                                            <ListItemAvatar>
                                                <Avatar alt="avatar" src={`http://127.0.0.1:8000${m.profile_picture}`} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={m.name}
                                                secondary={m.email}
                                            />
                                            <ListItemSecondaryAction>
                                                {user.user_type === "teacher" &&
                                                    <IconButton edge="end" aria-label="delete" onClick={() => removeStudent(m.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Box>
            <AddMember
                open={open}
                closeDialog={closeAddDialog}
                title="Add Student"
                classId={classId}
            />
        </Container>
    );
}

export default ClassMembers;
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../axios';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { assignmentTeacherDrawerId, currentClassId, currentAssignmentId } from '../../../../atoms';
import { format } from 'date-fns';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';


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
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TextField } from '@material-ui/core';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
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


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AssignmentList = () => {
    const classes = useStyles();
    const dense = false;


    const setAssignmentId = useSetRecoilState(currentAssignmentId);
    const classId = useRecoilValue(currentClassId);
    const setIndex = useSetRecoilState(assignmentTeacherDrawerId);
    const [list, setList] = useState([]);

    //get Created Assignment list
    function getCreatedAssignments() {
        axiosInstance.get(`assignment/${classId}/list`)
            .then((res) => {
                setList(res.data);
                console.log(res.data);
            })
    }

    useEffect(() => {
        getCreatedAssignments();
        // eslint-disable-next-line
    }, [])

    // set assignment and index
    function handleClick(id) {
        setAssignmentId(id);
        setIndex(1);
    }

    //create assignment
    const [openState, setOpenState] = useState(false);
    const openDialog = () => {
        setOpenState(true);
    }

    const closeDialog = () => {
        setOpenState(false);
    }

    const [selectedQuesFile, setSelectedQuesFile] = useState(null);
    const [isFile, setIsFile] = useState(false);
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [marks, setMarks] = useState(0);
    const [due, setDue] = useState(new Date());
    const [error, setError] = useState(false)

    const handleDue = (date) => {
        setDue(date);
    }

    const handleFile = e => {
        if (e.target.files[0]) {
            setSelectedQuesFile(e.target.files[0]);
            setIsFile(true);
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        let submit = true;
        setError(false);
        if (name === "") {
            setError(true);
            submit = false;
        }

        if (submit) {
            let form_data = new FormData();
            form_data.append('name', name);
            if (instructions !== "") {
                form_data.append('instructions', instructions);
            }
            form_data.append('total_marks', marks);
            form_data.append('class_id', classId);
            form_data.append('due_on', format(due, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSxxx"));
            if (isFile) {
                form_data.append('ques_file', selectedQuesFile);
            }
            axiosInstance.post(`assignment/create-assignment`, form_data)
                .then((res) => {
                    console.log(res);
                    closeDialog();
                    window.location.reload();
                })
                .catch(err => console.log(err));
        }

    }



    return (
        <div style={{ paddingTop: "24px", paddingLeft: "24px" }}>
            <div>
                <Box m={0} p={1}>
                    <Grid container spacing={1} direction="row" alignItems="flex-end" alignContent="flex-end">
                        <Grid item xs={12} sm={10} md={8}>
                            <Typography variant="h6">
                                <span style={{ marginRight: "20px" }}>Created Assignments</span>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    className={classes.button}
                                    onClick={openDialog}
                                    startIcon={<AddCircleIcon />}
                                    style={{ marginLeft: 0 }}
                                >
                                    Create New Assignment
                                </Button>
                            </Typography>
                            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
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
                                            No Assignments Created
                                        </Typography>
                                    }
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>

            {/* Create dialog */}
            <Dialog
                open={openState}
                TransitionComponent={Transition}
                keepMounted
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Create Assignment</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="name"
                            label="Name"
                            type="text"
                            id="name"
                            error={error}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="instructions"
                            label="Instructions"
                            type="textarea"
                            id="instructions"
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            name="marks"
                            label="Marks"
                            type="number"
                            id="marks"
                            onChange={(e) => setMarks(e.target.value)}
                        />
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                required
                                fullWidth
                                margin="normal"
                                id="due"
                                label="Due Date"
                                value={due}
                                onChange={handleDue}
                                KeyboardButtonProps={{
                                    'aria-label': 'change start_time',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <Box mt={3}>
                            <label>Question File:</label>
                            <br></br>
                            <input
                                className={classes.input}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={handleFile}
                            />
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={closeDialog} variant="contained" >
                        Close
                    </Button>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AssignmentList;
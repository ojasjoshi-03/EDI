import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../axios';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { assignmentTeacherDrawerId, currentResponseId } from '../../../../atoms';
import { format } from 'date-fns';

//MUI
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Box from '@material-ui/core/Box';
import { Button, Divider, Typography } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import DescriptionIcon from '@material-ui/icons/Description';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TextField } from '@material-ui/core';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GradedDetails = () => {
    const setIndex = useSetRecoilState(assignmentTeacherDrawerId);
    const responseId = useRecoilValue(currentResponseId);
    const [gd, setGd] = useState([]);

    const [marks, setMarks] = useState(0);
    const [remark, setRemark] = useState("");

    //get grade details
    function getGradeDetails() {
        axiosInstance.get(`assignment/${responseId}/graded-response`)
            .then((res) => {
                setGd(res.data);
                console.log(res.data);
                setMarks(res.data.mark);
                setRemark(res.data.remark);
            })
    }

    useEffect(() => {
        getGradeDetails()
        // eslint-disable-next-line
    }, [])

    //update grade
    const [openState, setOpenState] = useState(false);
    const openDialog = () => {
        setOpenState(true);
    }

    const closeDialog = () => {
        setOpenState(false);
    }


    const handleSubmit = e => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append("marks_scored", marks);
        form_data.append("remark", remark);
        axiosInstance.put(`assignment/${gd.grade_id}/update-grade`, form_data)
            .then((res) => {
                console.log(res);
                closeDialog();
                window.location.reload();
            })
            .catch(err => console.log(err));
    }


    return (
        <div>
            <Box display="flex" onClick={() => setIndex(4)}>
                <Button style={{ textTransform: 'lowercase', paddingLeft: 0 }}>
                    <ChevronLeftIcon color="primary" />
                    <Typography color="primary">
                        back
                    </Typography>
                </Button>
            </Box>
            <Box m={0} pt={3} pl={3}>
                <Typography variant="h5">
                    Student Response
                </Typography>
                <Divider></Divider>
                <Box pt={2}>
                    <Box>
                        <Typography style={{ fontWeight: 500 }} component="span">
                            Name: {" "}
                        </Typography>
                        <Typography component="span">
                            {gd.name}
                        </Typography>
                        <br />
                        <Typography style={{ fontWeight: 500 }} component="span">
                            Email: {" "}
                        </Typography>
                        <Typography component="span">
                            {gd.email}
                        </Typography>
                    </Box>
                    <Box pt={2} mb={1}>
                        <Typography style={{ fontWeight: 500 }}>
                            Submitted File:
                        </Typography>
                    </Box>
                    <Link href={`http://127.0.0.1:8000${gd.submission_file}`} target="_blank" style={{ textDecoration: "None" }}>
                        <Paper style={{ backgroundColor: "#e1f5fe", maxWidth: "650px" }} elevation={2}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: "white" }}>
                                        <DescriptionIcon color="primary" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={gd.submission_file && gd.submission_file.split("/").pop()}
                                />
                            </ListItem>
                        </Paper>
                    </Link>
                </Box>
                <Box pt={1} pb={2}>
                    <Typography>
                        {gd.submited_date && `Submitted on ${format(new Date(gd.submited_date), "MMMM dd,yyyy HH:mm")}`}
                    </Typography>
                </Box>
                <Divider></Divider>
                <Box pt={2}>
                    <Typography variant="h5">
                        Grade Details
                    </Typography>
                </Box>
                <Box pt={2}>
                    <Box>
                        <Typography component="span" style={{ fontWeight: 500 }}>
                            Marks Scored: {" "}
                        </Typography>
                        <Typography component="span">
                            {gd.mark}
                        </Typography>
                        <br />
                        <Typography component="span" style={{ fontWeight: 500 }}>
                            Remarks: {" "}
                        </Typography>
                        <Typography component="span">
                            {gd.remark}
                        </Typography>
                    </Box>
                    <Box mt={3}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={openDialog}
                        >
                            Update Grade
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* grade dialog */}
            <Dialog
                open={openState}
                TransitionComponent={Transition}
                keepMounted
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Add Grade</DialogTitle>
                <DialogContent>
                    <form>
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
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="remark"
                            label="Remark"
                            type="text"
                            id="remarks"
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={closeDialog} variant="contained" >
                        Close
                    </Button>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                        ADD
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GradedDetails;
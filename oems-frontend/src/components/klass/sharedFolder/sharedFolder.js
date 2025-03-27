import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../axios';
import { useRecoilValue } from 'recoil';
import { userData, currentClassId } from '../../../atoms';
import { format } from 'date-fns'

//MUI
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        width: 500,
    },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const SharedFolder = () => {
    const classes = useStyles();
    const dense = false;
    const classId = useRecoilValue(currentClassId);

    const [files, setFiles] = useState([])
    const user = useRecoilValue(userData);

    function getAllFiles() {
        axiosInstance.get(`sharedfolder/${classId}`)
            .then((res) => {
                setFiles(res.data);
                console.log(res);
            })
    }

    useEffect(() => {
        getAllFiles()
        // eslint-disable-next-line
    }, [])

    //upload files 
    const [selectedFileName, setSelectedFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFile, setIsFile] = useState(false);
    const [openState, setOpenState] = useState(false);
    const openDialog = () => {
        setOpenState(true);
    }

    const closeDialog = () => {
        setOpenState(false);
    }


    const handleChange = (e) => {
        setSelectedFileName(e.target.files[0].name);
        setSelectedFile(e.target.files[0]);
        if (e.target.files[0]) {
            setIsFile(true);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('title', selectedFileName);
        form_data.append('filefield', selectedFile);
        form_data.append('class_id', classId)

        axiosInstance.post(`sharedfolder/uploadfile`, form_data)
            .then(res => {
                console.log(res);
                closeDialog();
                window.location.reload();
            })
            .catch(err => console.log(err));
    }
    // delete file
    const [openAlert, setOpenAlert] = useState(false);
    const [currentFileId, setCurrentFileId] = useState(0);
    const openDeleteDialog = (file_id) => {
        setOpenAlert(true);
        setCurrentFileId(file_id);
    }

    const closeDeleteDialog = () => {
        setOpenAlert(false);
        setCurrentFileId(0);
    }

    const handleDelete = id => {
        axiosInstance
            .delete(`sharedfolder/delete-shared-file/${id}`)
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div>
            <Box m={0} p={3}>
                <Grid container spacing={1} direction="row" justify="center" alignItems="flex-end" alignContent="flex-end">
                    <Grid item xs={12} sm={10} md={8}>
                        <Typography variant="h6" className={classes.title}>
                            Shared Folder
                            <Button
                                variant="outlined"
                                color="primary"
                                className={classes.button}
                                startIcon={<CloudUploadIcon />}
                                onClick={openDialog}
                                style={{ marginLeft: "20px" }}
                            >
                                Upload File
                            </Button>
                        </Typography>
                        <Divider style={{ marginBottom: "10px" }} />
                        <div className={classes.demo}>
                            <List dense={dense}>
                                {files.length > 0 ? files.map(f => (
                                    <div key={f.id}>
                                        <Paper style={{ marginTop: "10px", backgroundColor: "#e1f5fe" }}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar style={{ backgroundColor: "white" }}>
                                                        <DescriptionIcon color="primary" />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <Link href={`http://127.0.0.1:8000${f.filefield}`} target="_blank" style={{ textDecoration: "None" }}>
                                                    <ListItemText
                                                        primary={f.title}
                                                        secondary={`Uploaded by ${f.name} on ${format(new Date(f.timestamp), "dd-MM-yyyy")}`}
                                                    />
                                                </Link>
                                                <ListItemSecondaryAction>
                                                    {f.added_by === user.user_id &&
                                                        <IconButton edge="end" aria-label="delete" onClick={() => openDeleteDialog(f.id)}>
                                                            <DeleteIcon style={{ color: "#424242" }} />
                                                        </IconButton>}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </Paper>
                                    </div>
                                )) :
                                    <Typography variant="overline" display="block" gutterBottom>
                                        Shared Folder is Empty
                                    </Typography>
                                }
                            </List>
                        </div>
                    </Grid>
                </Grid>
            </Box>

            {/* upload dialog */}
            <Dialog
                open={openState}
                TransitionComponent={Transition}
                keepMounted
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Upload File</DialogTitle>
                <DialogContent>
                    <input
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={closeDialog} variant="contained" >
                        Close
                    </Button>
                    {isFile ?
                        (<Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                            UPLOAD
                        </Button>)
                        :
                        (<Button variant="contained" disabled>
                            UPLOAD
                        </Button>
                        )
                    }
                </DialogActions>
            </Dialog>

            {/* delete dialog */}
            <Dialog
                open={openAlert}
                TransitionComponent={Transition}
                keepMounted
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Delete File</DialogTitle>
                <DialogContent>
                    <Typography varient="h3" style={{ marginBottom: "10px" }}>
                        Do you want to delete this file ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={closeDeleteDialog} variant="contained">
                        Close
                    </Button>
                    <Button type="submit" onClick={() => handleDelete(currentFileId)} variant="contained" color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SharedFolder;
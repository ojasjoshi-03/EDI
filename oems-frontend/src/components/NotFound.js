import React from 'react';
import { Link } from 'react-router-dom';
import Copyright from './copyright'

//IMAGE
import four0four from '../images/404.svg';

//MUI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import indigo from '@material-ui/core/colors/indigo';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    indigoPaper: {
        backgroundColor: indigo[50],
        minHeight: '100vh',
    },
}));

const NotFound = () => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper className={classes.indigoPaper}>
                <Box pt={16}>
                    <Grid container
                        direction="column"
                        alignItems="center"
                        justifyContent="center">

                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <img src={four0four} alt="404 page" width="90%" height="200" />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <br />
                            <Typography variant="h2" gutterBottom>
                                Page Not Found
                            </Typography>
                            <br />
                            <Link to="/" style={{ textDecoration: 'none' }} color="inherit">
                                <Button variant="contained" color="primary"> Back to Home </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </Box>
            </Paper>
        </div>
    );
}

export default NotFound;
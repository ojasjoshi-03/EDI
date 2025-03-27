import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil'
import { isLoggedIn } from '../../atoms';
import LMenu from './loggedInMenu';

//MUI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import MenuBookIcon from '@material-ui/icons/MenuBook';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(0),
	},
	title: {
		flexGrow: 1,
	},
}));

export default function Navbar() {

	const login = useRecoilValue(isLoggedIn);
	const classes = useStyles();
    const history = useHistory();

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="logo" onClick={() => history.push('/')}>
						<MenuBookIcon style={{ fontSize: 30 }} />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						OEMS
					</Typography>
					{login ?	<LMenu/>
							:	<>
									<Box mr={1}>
										<Button variant="outlined" color="inherit" href="/register">
											Register
										</Button>
									</Box>
									<Button variant="outlined" color="inherit" href="/login">
										Login
									</Button>
								</>
          			}
				</Toolbar>
			</AppBar>
		</div>
	);
}

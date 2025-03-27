import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { currentClassId, currentTabId } from '../../atoms';
import { useParams } from 'react-router-dom';

import Assignment from './assignment/assignment'
import Chat from './chat/chat'
import ClassMembers from './classMembers/classMembers'
import Quiz from './quiz/quiz'
import SharedFolder from './sharedFolder/sharedFolder'

//MUI
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: theme.palette.background.paper
    }
}));

export default function Klass() {

    const { classId } = useParams();
    const [currentKlassId, setCurrentKlassId] = useRecoilState(currentClassId);
    const [currentTab, setCurrentTab] = useRecoilState(currentTabId);
    setCurrentKlassId(classId);

    console.log(classId);
    console.log(currentKlassId);

    const classes = useStyles();
    //const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {
        return () => {
            setCurrentTab(0);
            console.log("clean up");
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div className={classes.root}>
            <AppBar position="sticky" color="default">
                <Tabs
                    value={currentTab}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Chat" {...a11yProps(0)} />
                    <Tab label="Shared Folder" {...a11yProps(1)} />
                    <Tab label="Quiz" {...a11yProps(2)} />
                    <Tab label="Assignment" {...a11yProps(3)} />
                    <Tab label="Class Members" {...a11yProps(4)} />
                </Tabs>
            </AppBar>
            <TabPanel value={currentTab} index={0} style={{ backgroundColor: "#e8eaf6" }} >
                <Chat classId={classId} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <SharedFolder />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
                <Quiz />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
                <Assignment />
            </TabPanel>
            <TabPanel value={currentTab} index={4}>
                <ClassMembers />
            </TabPanel>
        </div>
    );
}

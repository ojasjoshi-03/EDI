import bannerlogo from '../images/home/bannerlogo.png';
import study from '../images/home/study.jpg'
import study2 from '../images/home/study2.jpg'
import chat from '../images/home/chat.svg'
import folder from '../images/home/folder.svg'
import quiz from '../images/home/quiz.svg'
import assignment from '../images/home/assignment.svg'

//MUI
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';



const useStyles = makeStyles((theme) => ({
    con1: {
        textAlign: "center",
    },
    con2: {
        textAlign: 'center',
    },
    con3: {
        padding: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            marginTop: 24,
            marginLeft: 10,
            marginRight: 10
        },
        [theme.breakpoints.up('sm')]: {
            marginTop: 60,
            marginLeft: 200,
            marginRight: 200
        },
        [theme.breakpoints.up('md')]: {
            marginTop: 60,
            marginLeft: 230,
            marginRight: 230
        },
    },
    con4: {
        paddingLeft: "24px",
        paddingRight: "24px",
        textAlign: 'left',
        width: '100%',
    },
    changefontSize: {
        [theme.breakpoints.down('xs')]: {
            fontSize: 24
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: 32
        },
        [theme.breakpoints.up('md')]: {
            fontSize: 36
        },
    },
    changefontSize1: {
        [theme.breakpoints.down('xs')]: {
            fontSize: 36
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: 40
        },
        [theme.breakpoints.up('md')]: {
            fontSize: 45
        },
    }
}));

const infoarray1 = [
    {
        'logo': 'https://edu.google.com/assets/icons/pages/main/classroom/all-in-one-place.svg',
        'title': "All-in-one place",
        'body': 'Bring all your learning tools together and manage multiple classes in one central destination.'
    },
    {
        'logo': 'https://edu.google.com/assets/icons/pages/main/classroom/easy-to-use.svg',
        'title': "Easy to use",
        'body': 'OEMS is user friendly, anyone in your school, college or community can get up and running with OEMS in minutes.'
    },
    {
        'logo': 'https://edu.google.com/assets/icons/pages/main/classroom/built-for-collaboration.svg',
        'title': "Built for collaboration",
        'body': 'Share your work and collaborate  with the whole class using our built in shared folder and chat functionality.'
    },
    {
        'logo': 'https://edu.google.com/assets/icons/pages/main/classroom/access-from-anywhere.svg',
        'title': "Access from anywhere",
        'body': 'Empower teaching and learning from anywhere, on any device, and give your class more flexibility and mobility.'
    }
]

const infoarray2 = [
    {
        'id': 1,
        'head': 'CHAT',
        'title': 'Chat with your classmates',
        'logo': chat,
        'body': 'Stay connected and collaborate with class members wherever you are. Interact with your classmates in realtime using our in-built chat functionality. Ask doubts, discuss concepts and much more...'
    },
    {
        'id': 2,
        'head': 'QUIZ',
        'title': 'Test, grade and schedule quizzes',
        'logo': quiz,
        'body': 'Teachers can quickly assess students by setting quizzes in an MCQ format. Quizzes are automatically graded, just specify correct answers, points, and you are good to go. Monitor student submissions and responses from your quiz dashboard.'
    },
    {
        'id': 3,
        'head': 'ASSIGNMENT',
        'title': 'Test concepts using assignments',
        'logo': assignment,
        'body': 'Assign assignments to help students apply concepts. Access grading features from anywhere, even on mobile. Track student submission progress and manage their scores in your assignment dashboard.'
    },
    {
        'id': 4,
        'head': 'SHARED FOLDER',
        'title': 'Share study material on the go',
        'logo': folder,
        'body': 'Use our built-in shared folder to collaborate and share sheets, notes, documents and other study material with your class to increase productivity. All file types are supported.'
    }
]

const Home = () => {

    const classes = useStyles();

    const dir = useMediaQuery('(min-width:960px)') ? 'row' : 'column-reverse'
    const height = useMediaQuery('(min-width:960px)') ? 400 : 200

    return (
        <Container>
            <div className={classes.con1}>
                <Box mt={4} pt={8} pb={8} style={{ backgroundColor: "#e1f5fe", borderRadius: "20px" }}>
                    <Box display="flex" justifyContent="center">
                        <img src={bannerlogo} alt="logo" />
                        <Typography variant='h3' className={classes.changefontSize1}>
                            OEMS
                        </Typography>
                    </Box>
                    <Box mt={3}>
                        <Typography variant='h2' className={classes.changefontSize1}>
                            Where Teaching and Learning come Together
                        </Typography>
                    </Box>
                    <Box mt={4}>
                        <Typography variant='body1'>
                            <strong>Online Education Management System</strong> is the all-in-one place for teaching and learning. <br />
                            Our easy-to-use and secure tools helps educators manage, measure, and enrich learning experiences.
                        </Typography>
                    </Box>

                    <Box mt={8} fontSize="h6.fontSize" fontWeight={400} fontFamily="Monospace">
                        This project is built by: <br /> <Link href="https://github.com/VirajPatidar" color="inherit" target="_blank" rel="noopener">Viraj Patidar</Link> & <Link href="https://github.com/atharvadpatil" color="inherit" target="_blank" rel="noopener">Atharva Patil</Link>
                    </Box>
                    <Box mt={2}>
                        <Link href="https://github.com/" color="inherit" target="_blank" rel="noopener">
                            <Button
                                variant="outlined"
                                display="inline"
                                color="default"
                                startIcon={<GitHubIcon />}
                            >
                                Source Code
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </div>
            <Box mt={6} p={1}>
                <Grid container spacing={8}>
                    {infoarray1.map((info) => (
                        <Grid item key={info.title} xs={12} sm={6} md={3} className={classes.con2}>
                            <Paper elevation={3} style={{ padding: "12px", minHeight: "280px" }}>
                                <img src={info.logo} alt={info.title} />
                                <Box pt={1} fontSize="h6.fontSize" fontWeight="fontWeightRegular">
                                    {info.title}
                                </Box>
                                <br></br>
                                <Box fontSize={16} fontWeight="fontWeightLight">
                                    {info.body}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box mt={6} ml={1} mr={1}>
                <Card>
                    <CardMedia
                        component="img"
                        alt="study_image"
                        height="400"
                        image={study}
                        title="study_image"
                    />
                    <CardContent>
                        <Typography variant="subtitle1" component="p">
                            With OEMS, teachers can easily setup a virtual classroom to engross their students in a smooth learning experience
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box p={1} mt={6}>
                {infoarray2.map((info) =>
                    info.id % 2 !== 0 ?
                        (
                            <Box pt={6} pb={6} style={{ backgroundColor: "#e8eaf6" }} key={info.id}>
                                <Grid container alignItems="center">
                                    <Grid item sm={12} md={6} style={{ paddingLeft: "48px", paddingRight: "48px" }}>
                                        <img src={info.logo} width="100%" style={{ height: height }} alt={info.head} />
                                    </Grid>
                                    <Grid item sm={12} md={6} className={classes.con4} >
                                        <Box mt={3}>
                                            <Typography style={{ fontSize: "20px" }}>
                                                {info.head}
                                            </Typography>
                                        </Box>
                                        <Box mt={3}>
                                            <Typography variant='h4' className={classes.changefontSize}>
                                                {info.title}
                                            </Typography>
                                        </Box>
                                        <Box fontSize={18} fontWeight="fontWeightLight" mt={3}>
                                            {info.body}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                        :
                        (
                            <Box pt={6} pb={6} style={{ backgroundColor: "#e1f5fe" }} key={info.id}>
                                <Grid container direction={dir} alignItems="center">
                                    <Grid item sm={12} md={6} className={classes.con4} >
                                        <Box mt={3}>
                                            <Typography style={{ fontSize: "20px" }}>
                                                {info.head}
                                            </Typography>
                                        </Box>
                                        <Box mt={3}>
                                            <Typography variant='h4' className={classes.changefontSize}>
                                                {info.title}
                                            </Typography>
                                        </Box>
                                        <Box fontSize={18} fontWeight="fontWeightLight" mt={3}>
                                            {info.body}
                                        </Box>
                                    </Grid>
                                    <Grid item sm={12} md={6} style={{ paddingLeft: "48px", paddingRight: "48px" }}>
                                        <img src={info.logo} width="100%" style={{ height: height }} alt={info.head} />
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                )}

            </Box>
            <Box className={classes.con3}>
                <Typography variant='h4' className={classes.changefontSize} component="div">
                    <Box fontWeight={350}>
                        "The function of education is to teach one to think intensively and to think critically. Intelligence plus character – that is the goal of true education"
                    </Box>
                </Typography>
                <br></br>
                <Typography variant="h6" component="div">
                    <Box fontWeight={500}>
                        -   Martin Luther King
                    </Box>
                </Typography>
            </Box>
            <Box mt={12} p={1}>
                <Grid container alignItems="center">
                    <Grid item sm={12} md={6}>
                        <img src={study2} width="100%" alt="study_image" />
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Typography variant='h3' className={classes.changefontSize} component="div">
                            <Box pl={3} pt={4} fontWeight={350}>
                                Create your account to use OEMS as your daily learning platform
                            </Box>
                        </Typography>
                        <Typography variant='body1' component="div">
                            <Box pl={3} pt={3} fontWeight={350}>
                                To explore more features of OEMS, create an account to get started.
                            </Box>
                        </Typography>
                        <Box pl={3} pt={3}>
                            <Button pl={3} pt={3} variant="outlined" color="primary" href="/register">Sign Up</Button>
                        </Box>

                    </Grid>
                </Grid>
            </Box>
            <Box mt={6} mb={6} p={1}>
                <Grid container justify="center">
                    <Grid item style={{ display: "flex", paddingBottom: "10px" }}>
                        <Box pr={3} pt={4}>
                            <Typography>
                                Follow us on:
                            </Typography>
                        </Box>
                        <Box pt={4} pr={2}>
                            <FacebookIcon onClick={() => window.location.href = 'https://www.facebook.com/'} />
                        </Box>
                        <Box pt={4} pr={2}>
                            <InstagramIcon onClick={() => window.location.href = 'https://www.instagram.com/'} />
                        </Box>
                        <Box pt={4} pr={2}>
                            <TwitterIcon onClick={() => window.location.href = 'https://twitter.com/'} />
                        </Box>
                        <Box pt={4} pr={2}>
                            <YouTubeIcon onClick={() => window.location.href = 'https://www.youtube.com/'} />
                        </Box>
                    </Grid>
                </Grid>
                <Divider />
            </Box>
        </Container>
    );
}

export default Home;
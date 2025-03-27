import React, { useState, useEffect, useRef } from 'react'
import ChatMsg from './ChatMsg';
import axiosInstance from '../../../axios';
import { useRecoilValue } from 'recoil';
import { userData } from '../../../atoms';
import { format } from 'date-fns'

//MUI
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

const Chat = ({ classId }) => {

    const classes = useStyles();
    const user = useRecoilValue(userData);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [scroll, setScroll] = useState(0);
    const [texterror, setTexterror] = useState(false);

    const messagesEndRef = useRef(null)
    const chat = useRef(null)

    const scrollToBottom = () => {
        console.log(chat.current.clientHeight);
        console.log(window.innerHeight);
        if (chat.current.clientHeight > window.innerHeight) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0)
    }

    function getMessages() {
        axiosInstance
            .get(`chat/message/${classId}`)
            .then((res) => {
                console.log(res);
                setMessages(res.data)
                if (res.data.length > 0) {
                    let latest_msg_id = res.data[res.data.length - 1].id
                    if (scroll !== latest_msg_id) {
                        setScroll(latest_msg_id);
                    }
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    useEffect(() => {
        scrollToBottom()
    }, [scroll]);

    useEffect(() => {
        getMessages()
        const interval = setInterval(() => {
            getMessages()
        }, 3000)

        return () => clearInterval(interval)
        // eslint-disable-next-line
    }, [])

    const handleSubmit = (e) => {

        let submit = true
        setTexterror(false)

        if (text === "") {
            setTexterror(true)
            submit = false
            console.log(submit)
        }

        if (submit) {
            axiosInstance
                .post(`chat/message`, {
                    "class_id": classId,
                    "message": text,
                    "sent_by": user.name,
                    "user_id": user.user_id,
                })
                .then((res) => {
                    console.log(res);
                    setText("");
                })
                .catch(err => {
                    console.log(err)
                    console.log({ err })
                });
        }
    };

    return (
        <div ref={chat} style={{padding: "24px"}}>
            {messages.length > 0 && messages.map(m => (
                <div key={m.id}>
                    {m.user_id === user.user_id ?
                        <ChatMsg
                            sentBy={m.sent_by.toUpperCase()}
                            side={'right'}
                            messages={[
                                m.message,
                            ]}
                            timestamp={format(new Date(m.timestamp), "dd-MM-yyyy 'at' HH:mm")}
                        />
                        :
                        <ChatMsg
                            avatar={`http://127.0.0.1:8000${m.profile_picture}`}
                            sentBy={m.sent_by.toUpperCase()}
                            messages={[
                                m.message,
                            ]}
                            timestamp={m.timestamp.substring(0, 10).concat(' at ', m.timestamp.substring(11, 16))}
                        />
                    }
                </div>
            ))}

            <Divider style={{ marginTop: "20px" }} />

            <Box style={{ marginTop: "5px", padding: "10px" }}>
                <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                    <div className={classes.margin}>
                        <Grid container spacing={3} alignItems="flex-end">
                            <Grid item style={{ minWidth: "65vw" }}>
                                <TextField
                                    variant="outlined"
                                    id="message"
                                    label="Message"
                                    name="message"
                                    size="small"
                                    value={text}
                                    fullWidth
                                    onChange={(e) => { setText(e.target.value); setTexterror(false); }}
                                    error={texterror}
                                />
                            </Grid>
                            <Grid item style={{ paddingLeft: 0 }}>
                                <IconButton type="submit" onClick={handleSubmit} style={{ marginBottom: 3, padding: 0 }}>
                                    <SendIcon color="primary" fontSize="large" />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
                <Box style={{ display: 'flex', justifyContent: 'center' }} >
                    <Chip label="Scroll to Top" color="primary" component="a" clickable onClick={scrollToTop} style={{ marginTop: "10px" }} />
                </Box>
                <div ref={messagesEndRef} />
            </Box>

        </div>
    );
}

export default Chat;
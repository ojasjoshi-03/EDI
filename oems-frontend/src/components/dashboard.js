import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { userData } from '../atoms';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../axios';

//MUI 
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteOutlined from '@material-ui/icons/DeleteOutlined'
import Box from '@material-ui/core/Box';
import { CardMedia } from '@material-ui/core';

function ClassCard({ klass, handleDelete }) {

    const history = useHistory();

    function getRandomImage() {
        return `https://source.unsplash.com/featured/?nature/${Math.floor(Math.random() * 100)}`
    }

    const classClick = (class_id) => {
        history.push(`/klass/${class_id}`);
    }

    return (
        <div>
            <Card raised={true}>
                <CardHeader
                    action={
                        <IconButton onClick={() => handleDelete(klass.class_id)}>
                            <DeleteOutlined />
                        </IconButton>
                    }
                    title={klass.class_name}
                    subheader={klass.teacher_name}
                />
                <CardActionArea onClick={() => classClick(klass.class_id)}>
                    <CardMedia
                        component="img"
                        alt="Study"
                        height="200"
                        image={getRandomImage()}
                        title="Study"
                    />
                    <CardContent>

                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    )
}


export default function Dashboard() {

    const [classes, setClasses] = useState([]);
    const user = useRecoilValue(userData)

    useEffect(() => {
        axiosInstance
            .get(`class/${user.id}`)
            .then((res) => {
                console.log(res);
                setClasses(res.data.classes)
            })
            .catch(err => {
                console.log(err)
            });
            // eslint-disable-next-line
    }, [])

    const handleDelete = (class_id) => {
        if (user.user_type === "student") {
            axiosInstance
                .delete(`class/member-class`, {
                    data: {
                        "class_id": class_id,
                        "student_id": user.id,
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
        else if (user.user_type === "teacher") {
            axiosInstance
                .delete(`class/manage-class`, {
                    data: {
                        "class_id": class_id,
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
    }

    return (
        <Box mt={4}>
            <Container>
                <Grid container spacing={3}>
                    {classes.map(c => (
                        <Grid item xs={12} md={6} lg={4} key={c.class_id}>
                            <ClassCard klass={c} handleDelete={handleDelete} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}
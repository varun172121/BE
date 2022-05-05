import React from "react";
import { Avatar, Card, Grid, Typography } from "@mui/material";
import {
    Group,
    Mood,
    PersonOff,
    PhoneAndroid,
    RecordVoiceOver,
    RemoveRedEye,
} from "@mui/icons-material";

const features = [
    {
        icon: <PhoneAndroid />,
        title: "Mobile Phone Detection",
        desc: "Utlising the CocoSSD model from Tensorflow.js, an accurate and precise detection of Mobile Phones and Laptops is possible.",
    },
    {
        icon: <RemoveRedEye />,
        title: "Eye Tracking",
        desc: "Webgazer.js is included to keep track of where the user is looking at constantly, and the model is trained in realtime.",
    },
    {
        icon: <PersonOff />,
        title: "No Person Detection",
        desc: "The Proctoring also keeps track of the user constantly, and detects immediately when the user has left the proctoring safe area.",
    },
    {
        icon: <Group />,
        title: "Multi Person Detection",
        desc: "Measures are also taken to detect more than one person in the frame, to avoid any possible occurrence of malpractices.",
    },
    {
        icon: <Mood />,
        title: "Head Pose Detection",
        desc: "The head position of the user is noted every once in a while to predict whether the user is honestly looking at their screen.",
    },
    {
        icon: <RecordVoiceOver />,
        title: "Mouth Tracking",
        desc: "Lip movement is recorded to deduce whether the person was talking during the test and to detect any occurrence of malpractice.",
    },
];

function Features() {
    return (
        <>
            <Grid
                container
                direction="column"
                alignItems="center"
                spacing={2}
                sx={{ py: 6 }}
            >
                <Grid item>
                    <Typography variant="button" textAlign="center">
                        Features
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="h3"
                        fontWeight="fontWeightBold"
                        maxWidth="md"
                        textAlign="center"
                    >
                        Examinator uses Tensorflow.js based Realtime Proctoring
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="h6"
                        maxWidth="lg"
                        textAlign="center"
                        color="text.secondary"
                    >
                        Utlising the power of various pre-trained Tensorflow.js
                        models, Examinator ensures a smooth and hassle-free
                        experience towards the End User.
                    </Typography>
                </Grid>
                <Grid
                    item
                    container
                    spacing={5}
                    justifyContent="center"
                    sx={{ mt: 2 }}
                >
                    {features.map((feature, index) => (
                        <Grid item md={6} lg={4} key={index}>
                            <Card
                                variant="outlined"
                                sx={{
                                    p: 5,
                                }}
                            >
                                <Grid
                                    container
                                    direction="column"
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                bgcolor: "secondary.main",
                                                mb: 3,
                                            }}
                                        >
                                            {feature.icon}
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="h6"
                                            textAlign="center"
                                            gutterBottom
                                        >
                                            {feature.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            textAlign="center"
                                        >
                                            {feature.desc}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </>
    );
}

export default Features;

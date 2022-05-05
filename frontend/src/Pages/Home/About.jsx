import React from "react";
import { Grid, Typography, Avatar, IconButton, Card } from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";
import RushilPhoto from "../../Assets/Images/rushil.png";
import TirthPhoto from "../../Assets/Images/tirth.png";
import VarunPhoto from "../../Assets/Images/varun.png";

const teamMembers = [
    {
        image: RushilPhoto,
        name: "Rushil Shah",
        desc: "I am a tech enthusiast who desires to obtain a position suitable for me and company that will allow me to utilize my technical skills, experience, and willingness to learn in making the organization successful.",
        linkedin: "https://www.linkedin.com/in/rushil-shah-22a4b61a6",
        github: "https://github.com/rushilshah23",
    },
    {
        image: TirthPhoto,
        name: "Tirth Thoria",
        desc: "A Python Enthusiast, Flutter and Web Geek and a Passionate Gamer. Being a dynamic programmer, I always like to get involved with development tasks where I get to learn various new technologies and concepts.",
        linkedin: "https://www.linkedin.com/in/tirth-thoria-0165b31b0/",
        github: "https://github.com/AceAltair13",
    },
    {
        image: VarunPhoto,
        name: "Varun Yadav",
        desc: "I am a technology enthusiast who likes to use my technical skills to achieve the goals of a company while expanding my learnings, knowledge, skills, and also the ability to lead a team successfully in any development.",
        linkedin: "https://www.linkedin.com/in/varun-yadav-4b5944207/",
        github: "https://github.com/varun172121",
    },
];

function About() {
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
                        About Us
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="h3"
                        fontWeight="fontWeightBold"
                        maxWidth="md"
                        textAlign="center"
                    >
                        Get To Know Our Team
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="h6"
                        maxWidth="lg"
                        textAlign="center"
                        color="text.secondary"
                    >
                        We are a group of three students from Shah & Anchor
                        Kutchhi Engineering College. The project was developed
                        under the guidance of Prof. Swati Nadkarni and Prof.
                        Komal Patil.
                    </Typography>
                </Grid>
                <Grid item sx={{ my: 2 }} spacing={5} container>
                    {teamMembers.map((member, index) => (
                        <Grid item md={4} key={index}>
                            <Card
                                variant="outlined"
                                sx={{
                                    p: 5,
                                }}
                            >
                                <Grid
                                    direction="column"
                                    alignItems="center"
                                    container
                                    spacing={3}
                                >
                                    <Grid item>
                                        <Avatar
                                            alt=""
                                            src={member.image}
                                            sx={{ height: 120, width: 120 }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="h5"
                                            fontWeight="fontWeightBold"
                                        >
                                            {member.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            textAlign="center"
                                        >
                                            {member.desc}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justifyContent="center"
                                    >
                                        <Grid item>
                                            <IconButton href={member.github}>
                                                <GitHub />
                                            </IconButton>
                                        </Grid>
                                        <Grid item>
                                            <IconButton href={member.linkedin}>
                                                <LinkedIn />
                                            </IconButton>
                                        </Grid>
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

export default About;

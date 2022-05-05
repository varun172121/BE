import React, { useEffect, useRef } from "react";
import { Button, Grid, Typography, Container } from "@mui/material";
import lottie from "lottie-web";
import HeaderImage from "../../Assets/LottieFiles/time.json";
import SchoolIcon from "@mui/icons-material/School";
import { Link } from "react-router-dom";

function Landing() {
    const container = useRef(null);

    useEffect(() => {
        const img = lottie.loadAnimation({
            container: container.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: HeaderImage,
        });

        return () => {
            img.destroy();
        };
    }, []);

    return (
        <>
            <Grid container alignItems="center" sx={{ py: 6 }}>
                <Grid item md={6} container>
                    <Grid item flexDirection="column" container spacing={1}>
                        <Grid item>
                            <Typography
                                variant="h2"
                                fontWeight="fontWeightBold"
                            >
                                Smart AI Proctor for Everyone
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="h6"
                                fontWeight="fontWeightBold"
                                sx={{ color: "text.secondary" }}
                            >
                                Examinator is an Online Examination System with
                                it's own Web Based AI Proctoring
                            </Typography>
                        </Grid>
                        <Grid item sx={{ my: 5 }}>
                            <Button
                                startIcon={<SchoolIcon />}
                                component={Link}
                                to="/login"
                                sx={{py: 2, px: 4}}
                            >
                                Get Started
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6}>
                    <Container ref={container} maxWidth="xs"></Container>
                </Grid>
            </Grid>
        </>
    );
}

export default Landing;

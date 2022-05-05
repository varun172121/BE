import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import ComingSoon from "../../../Assets/Images/coming_soon.svg";

const StudentMonitoring = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Container maxWidth="sm">
                <Stack textAlign="center">
                    <Box sx={{ mb: 4 }}>
                        <img
                            src={ComingSoon}
                            alt="Coming Soon"
                            style={{
                                width: "100%",
                                height: "auto",
                            }}
                        />
                    </Box>
                    <Typography variant="h5">
                        This feature is planned for a future update.
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default StudentMonitoring;

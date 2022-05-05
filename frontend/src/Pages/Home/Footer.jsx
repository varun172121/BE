import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";

function Footer() {
    return (
        <Box sx={{ py: 3, px: 2 }}>
            <Container maxWidth="sm">
                <Typography variant="body1" textAlign="center">
                    Copyright &copy;{" "}
                    <Link underline="none" href="/">
                        EXAMINATOR
                    </Link>
                    {" " + new Date().getFullYear() + "."}
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;

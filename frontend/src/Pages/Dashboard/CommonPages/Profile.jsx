import { Avatar, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import NumbersIcon from "@mui/icons-material/Numbers";
import SchoolIcon from "@mui/icons-material/School";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";

const FeatureStack = (props) => {
    const { Icon, text } = props;
    return (
        <Stack direction="row" spacing={1}>
            <Icon sx={{ color: "text.secondary" }} />
            <Typography variant="body1" color="text.secondary" noWrap>
                {text}
            </Typography>
        </Stack>
    );
};

const Profile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const initials = `${currentUser.firstName[0]}${
        currentUser.lastName[0] ?? ""
    }`;

    return (
        <Grid container spacing={3}>
            <Grid item lg={3} md={4} sm={12} xs={12}>
                <Paper
                    sx={{
                        p: 3,
                    }}
                    elevation={4}
                >
                    <Stack direction="column" spacing={2}>
                        <Avatar
                            sx={{
                                height: 96,
                                width: 96,
                                bgcolor: "secondary.light",
                                fontSize: 48,
                            }}
                        >
                            {initials}
                        </Avatar>
                        <Stack direction="column">
                            <Typography
                                variant="h5"
                                fontWeight="fontWeightBold"
                            >
                                {currentUser.firstName} {currentUser.lastName}
                            </Typography>
                            <Stack direction="row" alignItems="center">
                                <NumbersIcon fontSize="inherit" />
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    {currentUser.userId}
                                </Typography>
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <FeatureStack
                                Icon={SchoolIcon}
                                text={currentUser.role.toUpperCase()}
                            />
                            <FeatureStack
                                Icon={LocalPhoneIcon}
                                text={currentUser.phoneNumber}
                            />
                            <FeatureStack
                                Icon={EmailIcon}
                                text={currentUser.emailId}
                            />
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Profile;

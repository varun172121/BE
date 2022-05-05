import React from "react";
import {
    Container,
    Button,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Card,
    Avatar,
    LinearProgress,
} from "@mui/material";
import { Link as _Link } from "react-router-dom";
import Logo from "../../Components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Api/auth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BackgroundImage from "../../Assets/Images/cubes.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidation } from "../../Validations/loginValidation";

function Login() {
    const dispatch = useDispatch();
    const { isFetching } = useSelector((state) => state.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginValidation),
    });

    const onSubmit = (data) => {
        console.log(data);
        login(dispatch, data);
    };

    return (
        <>
            {isFetching && <LinearProgress color="secondary" />}
            <Box
                component="main"
                sx={{
                    height: isFetching ? "calc(100vh - 4px)" : "100vh",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "primary.dark",
                    backgroundImage: `url(${BackgroundImage})`,
                }}
            >
                <Container maxWidth="xs">
                    <Card sx={{ p: 3, mt: 10 }} elevation={4}>
                        <Box
                            sx={{
                                paddingY: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: "secondary.dark" }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Logo variant="h4" />
                            <Typography variant="h6">Sign In</Typography>
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit(onSubmit)}
                                sx={{ mt: 3 }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            {...register("emailId")}
                                            error={!!errors.emailId}
                                            helperText={
                                                errors?.emailId?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            {...register("password")}
                                            error={!!errors.password}
                                            helperText={
                                                errors?.password?.message
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    color="success"
                                    disabled={isFetching}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In To Examinator
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link
                                            variant="body2"
                                            component={_Link}
                                            to="/register"
                                            underline="hover"
                                        >
                                            Don't have an account? Register here
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    );
}

export default Login;

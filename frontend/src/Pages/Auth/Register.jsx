import React, { useState } from "react";
import {
    MenuItem,
    Container,
    Button,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Avatar,
    LinearProgress,
    Card,
} from "@mui/material";
import { Link as _Link, useHistory } from "react-router-dom";
import Logo from "../../Components/Logo";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidation } from "../../Validations/registerValidation";
import { registerUser } from "../../Api/auth";
import { useDispatch, useSelector } from "react-redux";
import BackgroundImage from "../../Assets/Images/cubes.png";

const roles = [
    {
        value: "student",
        label: "Student",
    },
    {
        value: "supervisor",
        label: "Supervisor",
    },
];

function Register() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { isFetching } = useSelector((state) => state.user);
    const [role, setRole] = useState(roles[0].value);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerValidation),
    });

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const onSubmit = (data) => {
        console.log(data);
        const { confirmPassword, ...rest } = data;
        registerUser(dispatch, rest, role, history);
    };

    return (
        <>
            {isFetching && <LinearProgress color="secondary" />}
            <Box
                component="main"
                sx={{
                    minHeight: "100vh",
                    height: isFetching ? "calc(100% - 4px)" : "100%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "primary.dark",
                    backgroundImage: `url(${BackgroundImage})`,
                }}
            >
                <Container maxWidth="xs">
                    <Card sx={{ p: 3, my: 2 }} elevation={4}>
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
                            <Typography variant="h6">Sign Up</Typography>
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit(onSubmit)}
                                sx={{ mt: 3 }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="firstName"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            autoFocus
                                            {...register("firstName")}
                                            error={
                                                errors.firstName ? true : false
                                            }
                                            helperText={
                                                errors.firstName &&
                                                errors.firstName.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            autoComplete="family-name"
                                            {...register("lastName")}
                                            error={
                                                errors.lastName ? true : false
                                            }
                                            helperText={
                                                errors.lastName &&
                                                errors.lastName.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            {...register("emailId")}
                                            error={
                                                errors.emailId ? true : false
                                            }
                                            helperText={
                                                errors.emailId &&
                                                errors.emailId.message
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
                                            error={
                                                errors.password ? true : false
                                            }
                                            helperText={
                                                errors.password &&
                                                errors.password.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="reenter-password"
                                            label="Re-Enter Password"
                                            type="password"
                                            id="reenter-password"
                                            autoComplete="new-password"
                                            {...register("confirmPassword")}
                                            error={
                                                errors.confirmPassword
                                                    ? true
                                                    : false
                                            }
                                            helperText={
                                                errors.confirmPassword &&
                                                errors.confirmPassword.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="phone"
                                            label="Phone Number"
                                            type="tel"
                                            id="phone"
                                            autoComplete="tel"
                                            {...register("phoneNumber")}
                                            error={
                                                errors.phoneNumber
                                                    ? true
                                                    : false
                                            }
                                            helperText={
                                                errors.phoneNumber &&
                                                errors.phoneNumber.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="role"
                                            name="role"
                                            required
                                            select
                                            fullWidth
                                            label="Role"
                                            value={role}
                                            onChange={handleRoleChange}
                                        >
                                            {roles.map((option) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    color="success"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign Up
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link
                                            variant="body2"
                                            component={_Link}
                                            to="/login"
                                            underline="hover"
                                        >
                                            Already have an account? Sign in
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

export default Register;

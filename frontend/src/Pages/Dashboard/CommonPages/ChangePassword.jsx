import { Button, Grid, Paper, Stack, TextField } from "@mui/material";
import React from "react";
import { changePasswordValidation } from "../../../Validations/changePasswordValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../Api/auth";

const ChangePassword = () => {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(changePasswordValidation),
    });

    const onSubmit = (data) => {
        // console.log(data);
        changePassword(dispatch, data);
    };

    return (
        <Grid container component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid item lg={4} md={6} sm={12} xs={12}>
                <Paper sx={{ p: 3 }} elevation={4}>
                    <Stack direction="column" spacing={3}>
                        <TextField
                            label="Old Password"
                            fullWidth
                            type="password"
                            {...register("oldPassword")}
                            error={!!errors.oldPassword}
                            helperText={
                                errors.oldPassword && errors.oldPassword.message
                            }
                        />
                        <TextField
                            label="New Password"
                            fullWidth
                            type="password"
                            {...register("newPassword")}
                            error={!!errors.newPassword}
                            helperText={
                                errors.newPassword && errors.newPassword.message
                            }
                        />
                        <Button fullWidth size="large" type="submit">
                            Change Password
                        </Button>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ChangePassword;

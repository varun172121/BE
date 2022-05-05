import { Grid, Paper, Typography } from "@mui/material";

const FormContainer = (props) => {
    return (
        <Paper sx={{ p: 3 }} elevation={4}>
            <Typography variant="body1" gutterBottom fontWeight="fontWeightBold" color="text.secondary">
                {props.title}
            </Typography>
            <Grid container spacing={2} mt={1}>
                {props.children}
            </Grid>
        </Paper>
    );
};

export default FormContainer;

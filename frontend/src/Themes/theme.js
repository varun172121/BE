import { createTheme } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { customShadows } from "./shadows";

const theme = createTheme({
    palette: {
        text: {
            primary: "#2D3743",
            secondary: "#646E73",
        },
        secondary: deepOrange,
    },
    components: {
        MuiButton: {
            defaultProps: {
                variant: "contained",
            },
        },
    },
    typography: {
        fontFamily: ["Inter"],
    },
    shadows: customShadows(),
    shape: {
        borderRadius: 8,
    },
});

export default theme;

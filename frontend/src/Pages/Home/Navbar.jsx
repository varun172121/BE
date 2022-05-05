import React from "react";
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../../Components/Logo";
import {
    usePopupState,
    bindTrigger,
    bindMenu,
} from "material-ui-popup-state/hooks";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function Navbar() {
    const user = useSelector((state) => state.user.currentUser);
    const history = useHistory();

    const popupState = usePopupState({
        variant: "popover",
        popupId: "mobileNavMenu",
    });

    const authNavBarItems = (
        <>
            <Button
                variant="text"
                color="inherit"
                sx={{ ml: 2 }}
                component={Link}
                to="/login"
            >
                Sign In
            </Button>
            <Button
                color="primary"
                sx={{ ml: 2 }}
                component={Link}
                to="/register"
            >
                Sign Up
            </Button>
        </>
    );

    const gotoDashboard = (
        <Button
            color="primary"
            sx={{ ml: 2 }}
            component={Link}
            to="/dashboard"
            startIcon={<DashboardIcon />}
        >
            Go to dashboard
        </Button>
    );

    const desktopMenu = (
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {user ? gotoDashboard : authNavBarItems}
        </Box>
    );

    const mobileMenu = (
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
                size="large"
                color="inherit"
                {...bindTrigger(popupState)}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                {...bindMenu(popupState)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                {user ? (
                    <MenuItem onClick={() => history.push("/dashboard")}>
                        Go to dashboard
                    </MenuItem>
                ) : (
                    <>
                        <MenuItem onClick={() => history.push("/login")}>
                            Sign In
                        </MenuItem>
                        <MenuItem onClick={() => history.push("/register")}>
                            Sign Up
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" color="transparent" elevation={0}>
                <Container disableGutters>
                    <Toolbar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Logo variant="h6" />
                        </Box>
                        {desktopMenu}
                        {mobileMenu}
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}

export default Navbar;

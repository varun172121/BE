import React from "react";
import {
    Avatar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import Logo from "../../../Components/Logo";
import { drawerWidth } from "../../../Constants/sizes";
import { useDispatch, useSelector } from "react-redux";
import { setMobileOpen } from "../../../Features/dashboardSlice";

const DrawerItems = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    return props.drawerItems.map((item, index) => (
        <List
            subheader={
                <ListSubheader sx={{ pl: 3 }}>{item.subheader}</ListSubheader>
            }
            key={index}
        >
            {item.items.map((item, i) => (
                <ListItem
                    button
                    key={i}
                    sx={{ pl: 3 }}
                    disableGutters
                    onClick={() => {
                        dispatch(setMobileOpen());
                        history.push(item.to);
                    }}
                >
                    <ListItemIcon sx={{ minWidth: "40px" }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </List>
    ));
};

function DashboardDrawer(props) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);
    const mobileOpen = useSelector((state) => state.dashboard.mobileOpen);

    const drawer = (
        <>
            <Toolbar>
                <Logo variant="h5" />
            </Toolbar>
            <Box
                sx={{
                    m: 2,
                    p: 2,
                    display: "flex",
                    backgroundColor: "rgba(145, 158, 171, 0.12)",
                    borderRadius: 2,
                }}
            >
                <Box>
                    <Avatar sx={{ bgcolor: "secondary.light" }}>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                    </Avatar>
                </Box>
                <Box ml={2}>
                    <Stack>
                        <Typography variant="body1" fontWeight="fontWeightBold">
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2">
                            {user.role.toUpperCase()}
                        </Typography>
                    </Stack>
                </Box>
            </Box>
            <DrawerItems drawerItems={props.drawerItems} />
        </>
    );

    return (
        <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => dispatch(setMobileOpen())}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                    },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}

export default DashboardDrawer;

import React from "react";
import { Typography, Link } from "@mui/material";
import PropTypes from "prop-types";

function Logo(props) {
    return (
        <Typography
            variant={props.variant}
            sx={{ color: "primary.main", textDecoration: "none" }}
            fontWeight="fontWeightBold"
            component={Link}
            href="/"
        >
            EXAMINATOR
        </Typography>
    );
}

Logo.propTypes = {
    variant: PropTypes.string.isRequired,
};

export default Logo;

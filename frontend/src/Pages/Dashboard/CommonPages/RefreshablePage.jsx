import { Fab } from "@mui/material";
import React, { useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const RefreshablePage = (props) => {
    const { fetchExamFunction, children } = props;
    const { isFetching } = useSelector((state) => state.student);

    useEffect(fetchExamFunction, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {!isFetching && children}
            <Fab
                color="primary"
                sx={{ position: "fixed", bottom: 0, right: 0, m: 3 }}
                onClick={fetchExamFunction}
            >
                <RefreshIcon />
            </Fab>
        </>
    );
};

RefreshablePage.propTypes = {
    fetchExamFunction: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default RefreshablePage;

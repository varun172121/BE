import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Paper } from "@mui/material";

const CustomDataGrid = (props) => {
    const { rows, columns, noShadow, ...other } = props;
    const { isFetching } = useSelector((state) => state.dashboard);

    const noShadowProps = {
        variant: "outlined",
    };

    return (
        <Paper
            sx={{
                "& .custom-data-grid--isCorrect": {
                    bgcolor: "rgb(0, 255, 0, 0.2)",
                },
                "& .custom-data-grid--isIncorrect": {
                    bgcolor: "rgb(255, 0, 0, 0.2)",
                },
            }}
            {...(noShadow ? noShadowProps : {})}
        >
            <DataGrid
                rows={isFetching ? [] : rows}
                columns={columns}
                loading={isFetching}
                autoHeight
                disableSelectionOnClick
                getRowClassName={(params) => {
                    if (params.row.isSelected && params.row.isCorrect) {
                        return "custom-data-grid--isCorrect";
                    }
                    if (params.row.isSelected && !params.row.isCorrect) {
                        return "custom-data-grid--isIncorrect";
                    }
                }}
                {...other}
            />
        </Paper>
    );
};

CustomDataGrid.propTypes = {
    rows: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
};

CustomDataGrid.defaultProps = {
    rows: [],
    columns: [],
};

export default CustomDataGrid;

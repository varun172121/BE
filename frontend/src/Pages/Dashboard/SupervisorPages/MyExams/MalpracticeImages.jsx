import {
    Breadcrumbs,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Link,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import RefreshablePage from "../../CommonPages/RefreshablePage";
import { fetchMalpracticeByType } from "../../../../Api/supervisor";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

const MalpracticeImages = () => {
    const theme = useTheme();
    const { isFetching } = useSelector((state) => state.dashboard);
    const { malpracticeImages } = useSelector((state) => state.supervisor);
    const { examName } = useSelector((state) => state.supervisor.selectedExam);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const { examId, studentId, type } = useParams();
    const dispatch = useDispatch();
    const fetchMalpractices = () =>
        fetchMalpracticeByType(dispatch, examId, studentId, type);

    return (
        <>
            {" "}
            <Breadcrumbs sx={{ mb: 3 }} separator=">">
                <Link
                    color="black"
                    underline="hover"
                    component={RouterLink}
                    to="/dashboard/exam/my-exams"
                >
                    My Exams
                </Link>
                <Link
                    color="black"
                    underline="hover"
                    component={RouterLink}
                    to={`/dashboard/exam/my-exams/${examId}`}
                >
                    {examName}
                </Link>
                <Link
                    color="black"
                    underline="hover"
                    component={RouterLink}
                    to={`/dashboard/exam/my-exams/${examId}/view-responses`}
                >
                    View Responses
                </Link>
                <Typography>{studentId}</Typography>
            </Breadcrumbs>
            <RefreshablePage fetchExamFunction={fetchMalpractices}>
                <Grid container spacing={2}>
                    {isFetching ? (
                        <Grid item>
                            <Typography variant="body1">
                                Fetching malpractice data...
                            </Typography>
                        </Grid>
                    ) : (
                        malpracticeImages &&
                        malpracticeImages.map((image, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card>
                                    <CardActionArea
                                        onClick={() => {
                                            if (image.imageURL) {
                                                setIsOpen(true);
                                                setCurrentImage(index);
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Stack spacing={2}>
                                                {image.imageURL && (
                                                    <img
                                                        src={image.imageURL}
                                                        alt="Malpractice"
                                                        height="auto"
                                                        width="100%"
                                                    />
                                                )}
                                                <Stack>
                                                    <Typography
                                                        variant="body2"
                                                        textAlign="center"
                                                    >
                                                        {DateTime.fromISO(
                                                            image.time
                                                        ).toLocaleString(
                                                            DateTime.DATETIME_FULL_WITH_SECONDS
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
                {isOpen && malpracticeImages[currentImage].imageURL && (
                    <Lightbox
                        mainSrc={malpracticeImages[currentImage].imageURL}
                        onCloseRequest={() => setIsOpen(false)}
                        imageTitle={DateTime.fromISO(
                            malpracticeImages[currentImage].time
                        ).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}
                        reactModalStyle={{
                            overlay: {
                                zIndex: theme.zIndex.drawer + 1,
                            },
                        }}
                    />
                )}
            </RefreshablePage>
        </>
    );
};

export default MalpracticeImages;

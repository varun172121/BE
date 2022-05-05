import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Webcam from "react-webcam";
import { snackActions } from "../../Utils/SnackBarUtils";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ReplayIcon from "@mui/icons-material/Replay";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "@tensorflow/tfjs";
import * as blazeFace from "@tensorflow-models/blazeface";
import { uploadPreExamFace } from "../../Api/proctor";
import { Redirect } from "react-router-dom";

const PreExamFaceCapture = ({ examId }) => {
    const dispatch = useDispatch();
    const { exam } = useSelector((state) => state.exam);
    const webcamRef = useRef(null);
    const [model, setModel] = useState(null);
    const [image, setImage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showUploadBtn, setShowUploadBtn] = useState(false);
    const { faceRegistered, isFaceUploading } = useSelector(
        (state) => state.questionPaper
    );
    const [startExam, setStartExam] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);

    useEffect(() => {
        const loadModel = async () => {
            const model = await blazeFace.load();
            setModel(model);
        };
        loadModel();
    }, []);

    const videoConstraints = {
        height: 300,
        width: 350,
        facingMode: "user",
    };

    const processPredictions = (predictions) => {
        if (predictions.length > 1) {
            setErrorMsg("More than 1 person detected! Please try again.");
        } else if (predictions.length === 0) {
            setErrorMsg("No face detected! Please try again.");
        } else {
            setErrorMsg("");
            setShowUploadBtn(true);
        }
    };

    const captureImage = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const snapshot = new Image();
            snapshot.src = imageSrc;
            snapshot.height = videoConstraints.height;
            snapshot.width = videoConstraints.width;
            snapshot.onload = async () => {
                const predictions = await model.estimateFaces(snapshot);
                console.log(predictions);
                processPredictions(predictions);
            };
        }
    };

    const uploadImage = () => {
        uploadPreExamFace(dispatch, image, examId);
        // const uploadImage = new Image();
        // uploadImage.src = image;
        // const buffer = Buffer.from(image, "base64");
        // fs.writeFileSync("new-path.jpg", buffer);
        // console.log("upload image ",image);
        // uploadImage.onload = async () =>
        // console.log("image object",uploadImage)
        //  uploadPreExamFace(uploadImage);
    };

    const ButtonList = () => {
        return (
            <>
                {isPredicting && (
                    <Typography variant="h6" align="center">
                        Your face is being processed. Please wait...
                    </Typography>
                )}
                {!!image ? (
                    <Button
                        size="large"
                        fullWidth
                        startIcon={<ReplayIcon />}
                        sx={{ mt: 2 }}
                        onClick={() => {
                            setImage("");
                            setErrorMsg("");
                            setShowUploadBtn(false);
                        }}
                    >
                        Reset
                    </Button>
                ) : (
                    <Button
                        size="large"
                        fullWidth
                        startIcon={<CameraAltIcon />}
                        sx={{ mt: 2 }}
                        onClick={captureImage}
                        disabled={!(!!image || !!model)}
                    >
                        {!!model ? "Capture" : "Loading..."}
                    </Button>
                )}
                {showUploadBtn && (
                    <Button
                        size="large"
                        fullWidth
                        startIcon={<FileUploadIcon />}
                        color="success"
                        sx={{ mt: 1 }}
                        onClick={uploadImage}
                        disabled={isFaceUploading}
                    >
                        Upload Image
                    </Button>
                )}
            </>
        );
    };

    if (startExam) {
        return <Redirect to={`/take-exam/${exam.examId}/start`} />;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h5" color="inherit" mx="auto">
                        {exam.examName}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ p: 2 }} maxWidth="md">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            fontWeight="fontWeightBold"
                            textAlign="center"
                            gutterBottom
                        >
                            Face Capture & Registration
                        </Typography>
                    </Grid>
                    <Grid item container justifyContent="center" spacing={2}>
                        <Grid item xs={5}>
                            <Stack>
                                <Typography variant="h6">
                                    Instructions for Face Capture
                                </Typography>
                                <ol>
                                    <li>
                                        Please make sure that there is a
                                        proper lighting in the room
                                    </li>
                                    <li>
                                        Please ensure that your face is clearly
                                        visible in the camera.
                                    </li>
                                    <li>
                                        Please ensure that your face is in the
                                        center of the camera.
                                    </li>
                                    <li>
                                        Please be alone in the room during the
                                        examination.
                                    </li>
                                    <li>
                                        Please Wait for UploadImage Button to Appear
                                    </li>
                                </ol>
                            </Stack>
                        </Grid>
                        <Grid item xs={2} container justifyContent="center">
                            <Divider orientation="vertical" />
                        </Grid>
                        <Grid item xs={5} container justifyContent="center">
                            {!!image ? (
                                <img src={image} alt="face" />
                            ) : (
                                <Webcam
                                    audio={false}
                                    videoConstraints={videoConstraints}
                                    screenshotFormat="image/jpeg"
                                    ref={webcamRef}
                                    onUserMediaError={(e) =>
                                        snackActions.error(
                                            "Webcam Error: " + e.message
                                        )
                                    }
                                />
                            )}
                            {!!errorMsg && (
                                <Typography variant="body1" color="error">
                                    {errorMsg}
                                </Typography>
                            )}
                            {faceRegistered ? (
                                <Button
                                    sx={{ mt: 2 }}
                                    color="secondary"
                                    size="large"
                                    fullWidth
                                    onClick={() => setStartExam(true)}
                                >
                                    Start Exam
                                </Button>
                            ) : (
                                <ButtonList />
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Box
                sx={{
                    mt: "auto",
                    position: "static",
                }}
            >
                <AppBar position="sticky" elevation={0}>
                    <Toolbar variant="dense">
                        <Typography
                            variant="h6"
                            fontWeight="fontWeightBold"
                            mx="auto"
                        >
                            EXAMINATOR
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </Box>
    );
};

export default PreExamFaceCapture;

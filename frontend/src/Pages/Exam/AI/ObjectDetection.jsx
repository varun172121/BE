import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { sendExamEvent } from "../../../Api/proctor";


let net;
async function runObjectDetection(webcamRef, examId) {
    net = await cocoSsd.load();
    detect(net, webcamRef, examId);
}

async function detect(net, webcamRef, examId) {
    const video = webcamRef.current.video;
    const predictions = await net.detect(video);
    getPrediction(predictions, webcamRef.current.getScreenshot(), examId);

}

function getPrediction(predictions, image, examId) {
    let count = 0;
    predictions.forEach((obj) => {
        if (obj.score > 0.5) {
            let user = obj.class;
            switch (user) {
                case "person":
                    count++;
                    net.dispose();
                    break;
                case "cell phone":
                    console.log("Cell Phone Detected !");
                    sendExamEvent(image, examId, "CELL_PHONE_DETECTED");
                    net.dispose();

                    break;
                case "laptop":
                    console.log("Laptop detected !");
                    sendExamEvent(image, examId, "LAPTOP_DETECTED");
                    net.dispose();

                    break;
                default:
                    break;
            }
        }
    });
    if (count > 1) {
        console.log("More than one person detected !");
        sendExamEvent(image, examId, "MORE_THAN_ONE_PERSON_DETECTED");
        net.dispose();

    } else if (count === 0) {
        console.log("No Person Detected !");
        sendExamEvent(image, examId, "NO_PERSON_DETECTED");
        net.dispose();

    }
}

export default runObjectDetection;

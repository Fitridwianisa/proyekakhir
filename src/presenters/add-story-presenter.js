import { uploadStory } from '../models/story-model.js';

export const AddStoryPresenter = () => {
    let cameraStream = null;

    const startCamera = async (videoElement) => {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = cameraStream;
        } catch (error) {
            alert('Gagal mengakses kamera: ' + error.message);
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
    };

    const uploadStoryData = async (data) => {
        return await uploadStory(data);
    };

    return { startCamera, stopCamera, uploadStoryData };
};

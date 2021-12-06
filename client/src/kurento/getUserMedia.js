export const getUserMedia = async (constrains) => {
    try {
        return await navigator.mediaDevices.getUserMedia(constrains);
    } catch (e) {
        console.warn('getUserMedia error', e);
    }
}
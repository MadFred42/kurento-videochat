import { Context } from "../..";

const { useEffect, useContext } = require("react")

export const useStreamHook = ({ stream }) => {
    const { videoStore } = useContext(Context);

    useEffect(() => {
        videoStore.setSream(stream);
    }, [stream]);
};
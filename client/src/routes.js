import { JoinPage } from "./pages";
import { RoomPage } from "./pages";

export const AuthRoutes = [
    {
        path: '/videochatRoom',
        element: <RoomPage />,
    }
];

export const PublicRoutes = [
    {
        path: '/',
        element: <JoinPage />,
    }
];
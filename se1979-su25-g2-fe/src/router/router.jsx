import { createBrowserRouter } from "react-router-dom";
import UserList from "../page/admin/list/UserList";
// import các trang khác nếu cần

export const router = createBrowserRouter([

    {
        path: "/admin/users",
        element: <UserList />,
    },
]);

import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import UserLayout from "../layout/UserLayout.jsx";

const HomepageLazy = lazy(() => import("../page/Home/Homepage.jsx"));
const ProductListLazy = lazy(() => import("../page/Product/ProductList.jsx"));
const NotFoundLazy = lazy(() => import("../page/error/NotFound.jsx"));
const ProductDetailLazy = lazy(() => import("../page/Product/ProductDetail.jsx"));
const UserListLazy = lazy(() => import("../page/admin/user_management/UserList.jsx"));
const AddAccountLazy = lazy(() => import("../page/admin/user_management/AddInternalAccount.jsx"));
const UserDetailsLazy = lazy(() => import("../page/admin/user_management/UserDetails.jsx"));
const OrderListLazy = lazy(() =>import("../page/admin/order_management/OrderList.jsx"));
const router = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            { path: "/", element: <HomepageLazy /> },
            { path: "/products", element: <ProductListLazy /> },
            { path: "/products/:productId", element: <ProductDetailLazy /> }, // Thêm dòng này
            { path: "/admin/accounts", element: <UserListLazy /> },
            { path:"/admin/accounts/:id", element:<UserDetailsLazy />},
            { path:"/admin/accounts/add", element:<AddAccountLazy />},
            { path: "/admin/orders", element: <OrderListLazy /> },
            { path: "*", element: <NotFoundLazy /> },
        ],
    },
    {

    }
]);

export default router;

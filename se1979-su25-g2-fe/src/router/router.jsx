import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import UserLayout from "../layout/UserLayout.jsx";

const HomepageLazy = lazy(() => import("../page/Home/Homepage.jsx"));
const ProductListLazy = lazy(() => import("../page/Product/ProductList.jsx"));
const ProductManagementLazy = lazy(() => import("../page/admin/product/ProductManagement.jsx"));
const NotFoundLazy = lazy(() => import("../page/error/NotFound.jsx"));
const ProductDetailLazy = lazy(() => import("../page/Product/ProductDetail.jsx"));
const UserListLazy = lazy(() => import("../page/admin/user_management/UserList.jsx"));
const UserDetailsLazy = lazy(() => import("../page/admin/user_management/UserDetail.jsx"));
const OrderPageLazy = lazy(() => import("../page/Order/OrderPage.jsx"));
const CartPageLazy = lazy(() => import("../page/Cart/CartPage.jsx"));
const router = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            { path: "/", element: <HomepageLazy /> },
            { path: "/products", element: <ProductListLazy /> },
            { path: "/products/:productId", element: <ProductDetailLazy /> }, // Thêm dòng này
            { path: "/admin/accounts", element: <UserListLazy /> },
            { path:"/admin/accounts/:id", element:<UserDetailsLazy />},
            { path: "*", element: <NotFoundLazy /> },
            { path: "/admin/products", element: <ProductManagementLazy /> },
            { path: "/cart", element: <CartPageLazy /> },
            { path: "/order", element: <OrderPageLazy /> }, // Add this line

        ],
    },
    {

    }
]);

export default router;

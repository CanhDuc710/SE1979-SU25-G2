import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import UserLayout from "../layout/UserLayout.jsx";

const HomepageLazy = lazy(() => import("../page/Home/Homepage.jsx"));
const ProductListLazy = lazy(() => import("../page/Product/ProductList.jsx"));
const ProductManagementLazy = lazy(() => import("../page/admin/product/productList.jsx"));
const NotFoundLazy = lazy(() => import("../page/error/NotFound.jsx"));
const ProductDetailLazy = lazy(() => import("../page/Product/ProductDetail.jsx"));
const UserListLazy = lazy(() => import("../page/admin/user_management/UserList.jsx"));
const UserDetailsLazy = lazy(() => import("../page/admin/user_management/UserDetails.jsx"));
const CartLazy = lazy(() => import("../page/Cart/CartPage.jsx"));
const LoginLazy = lazy(() => import("../page/User/Login.jsx"));
const RegisterLazy = lazy(() => import("../page/User/Register.jsx"));
const UserProfileLazy = lazy(() => import("../page/User/UserProfile.jsx"));
const DiscountListLazy = lazy(() => import("../page/admin/discount/discountList.jsx"));
const router = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            { path: "/", element: <HomepageLazy /> },
            { path: "/products", element: <ProductListLazy /> },
            { path: "/products/:productId", element: <ProductDetailLazy /> },
            { path: "/admin/discounts", element: <DiscountListLazy /> },
            { path: "/cart", element: <CartLazy /> },
            { path: "/login", element: <LoginLazy /> },
            { path: "/register", element: <RegisterLazy /> },
            { path: "/userprofile", element: <UserProfileLazy /> },
            { path: "/admin/product-management", element: <ProductManagementLazy /> },
            { path: "/admin/accounts", element: <UserListLazy /> },
            { path: "/admin/accounts/:id", element:<UserDetailsLazy />},
            { path: "/products/:productId", element: <ProductDetailLazy /> },
            { path: "/admin/product-list", element: <ProductManagementLazy /> },
            { path: "/admin/user-management", element: <UserListLazy /> },
            { path: "*", element: <NotFoundLazy /> },
        ],
    },
    {

    }
]);

export default router;

import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layout/UserLayout.jsx";

const HomepageLazy = lazy(() => import("../page/Home/Homepage.jsx"));
const ProductListLazy = lazy(() => import("../page/Product/ProductList.jsx"));
const ProductManagementLazy = lazy(() => import("../page/admin/product/ProductManagement.jsx"));
const NotFoundLazy = lazy(() => import("../page/error/NotFound.jsx"));
const ProductDetailLazy = lazy(() => import("../page/Product/ProductDetail.jsx"));
const UserListLazy = lazy(() => import("../page/admin/user_management/UserList.jsx"));
const UserDetailsLazy = lazy(() => import("../page/admin/user_management/UserDetail.jsx"));
const CartLazy = lazy(() => import("../page/Cart/CartPage.jsx"));
const LoginLazy = lazy(() => import("../page/User/Login.jsx"));
const RegisterLazy = lazy(() => import("../page/User/Register.jsx"));
const UserProfileLazy = lazy(() => import("../page/User/UserProfile.jsx"));
const FAQLazy = lazy(() => import("../page/FAQ/FAQPage.jsx"));
const NotificationLazy = React.lazy(() => import("../page/Notification/NotificationPage.jsx"));
const AdminNotificationPageLazy = lazy(() => import("../page/Notification/AdminNotificationPage.jsx"));


const withSuspense = (Component) => (
    <Suspense fallback={<div>Loading...</div>}>
        <Component />
    </Suspense>
);

const router = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            { path: "/", element: withSuspense(HomepageLazy) },
            { path: "/products", element: withSuspense(ProductListLazy) },
            { path: "/products/:productId", element: withSuspense(ProductDetailLazy) },
            { path: "/cart", element: withSuspense(CartLazy) },
            { path: "/login", element: withSuspense(LoginLazy) },
            { path: "/register", element: withSuspense(RegisterLazy) },
            { path: "/userprofile", element: withSuspense(UserProfileLazy) },
            { path: "/admin/product-management", element: withSuspense(ProductManagementLazy) },
            { path: "/admin/accounts", element: withSuspense(UserListLazy) },
            { path: "/admin/accounts/:id", element: withSuspense(UserDetailsLazy) },
            { path: "/admin/product", element: withSuspense(ProductManagementLazy) },
            { path: "/admin/user-management", element: withSuspense(UserListLazy) },
            { path: "/faqs", element: withSuspense(FAQLazy) },
            { path: "*", element: withSuspense(NotFoundLazy) },
            { path: "/notifications", element: withSuspense(NotificationLazy) },
            { path: "/admin/notifications", element: withSuspense(AdminNotificationPageLazy) }


        ],
    },
]);

export default router;
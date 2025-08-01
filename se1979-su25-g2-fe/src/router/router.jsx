import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import UserLayout from "../layout/UserLayout.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute.jsx";

const HomepageLazy = lazy(() => import("../page/Home/Homepage.jsx"));
const ProductListLazy = lazy(() => import("../page/Product/ProductList.jsx"));
const ProductDetailLazy = lazy(() => import("../page/Product/ProductDetail.jsx"));
const CartPageLazy = lazy(() => import("../page/Cart/CartPage.jsx"));
const FAQLazy = lazy(() => import("../page/FAQ/FAQpage.jsx"));
const OrderPageLazy = lazy(() => import("../page/Order/OrderPage.jsx"));
const VNPayReturnPageLazy = lazy(() => import("../page/Order/VNPayReturnPage.jsx"));
const NotFoundLazy = lazy(() => import("../page/error/NotFound.jsx"));
const LoginLazy = lazy(() => import("../page/User/Login.jsx"));
const RegisterLazy = lazy(() => import("../page/User/Register.jsx"));

// Admin pages
const ProductManagementLazy = lazy(() => import("../page/admin/product/productList.jsx"));
const UserListLazy = lazy(() => import("../page/admin/user_management/UserList.jsx"));
const UserDetailsLazy = lazy(() => import("../page/admin/user_management/UserDetail.jsx"));
const AddInternalAccountLazy = lazy(() => import("../page/admin/user_management/AddInternalAccount.jsx"));
const ProductDetailAdminLazy = lazy(() => import("../page/admin/product/ProductDetail.jsx"));
const ProductEditLazy = lazy(() => import("../page/admin/product/ProductEdit.jsx"));
const EditInternalAccountLazy = lazy(() => import("../page/admin/user_management/EditInternalAccount.jsx"));
const BannerSettingLazy = lazy(() => import("../page/admin/setting/BannerSetting.jsx"));
const OrderHistoryLazy = lazy(() => import("../page/admin/user_management/OrderHistory.jsx"));
const CategorySettingLazy = lazy(() => import("../page/admin/setting/CategorySetting.jsx"));
const StoreInformationLazy = lazy(() => import("../page/admin/setting/StoreInformation.jsx"));
const ProductCreateLazy = lazy(() => import("../page/admin/product/ProductCreate.jsx"));
const CollectionManagementLazy = lazy(() => import("../page/admin/collection/CollectionList.jsx"));
const CollectionDetailLazy = lazy(() => import("../page/admin/collection/CollectionDetail.jsx"));
const CollectionCreateLazy = lazy(() => import("../page/admin/collection/CollectionCreate.jsx"));
const CollectionEditLazy = lazy(() => import("../page/admin/collection/CollectionEdit.jsx"));
const OrderListLazy = lazy(() => import("../page/admin/order_management/OrderList.jsx"));
const UserProfileLazy = lazy(() => import("../page/user/UserProfile.jsx"));
const DashboardLazy = lazy(() => import("../page/admin/dashboard/Dashboard.jsx"));

const OrderDetailLazy = lazy(() => import("../page/admin/order_management/OrderDetail.jsx"));
const DiscountListLazy = lazy(() => import("../page/admin/discount/discountList.jsx"));
const ForgotPasswordLazy = lazy(() => import("../page/password/ForgotPassword.jsx"));
const OtpResetLazy = lazy(() => import("../page/password/OtpReset.jsx"));
const ChangePasswordLazy = lazy(() => import("../page/password/ChangePassword.jsx"));const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        children: [
            { index: true, element: <HomepageLazy /> },
            { path: "products", element: <ProductListLazy /> },
            { path: "products/:productId", element: <ProductDetailLazy /> },
            { path: "cart", element: <CartPageLazy /> },
            { path: "user", element: <UserProfileLazy /> },
            { path: "faq", element: <FAQLazy /> },
            { path: "order", element: <OrderPageLazy /> },
            { path: "order/vnpay-return", element: <VNPayReturnPageLazy /> },
            { path: "login", element: <LoginLazy /> },
            { path: "register", element: <RegisterLazy /> },
            { path: "*", element: <NotFoundLazy /> },
            { path: "forgot-password", element: <ForgotPasswordLazy /> },
            { path: "reset-otp", element: <OtpResetLazy /> },
            { path: "change-password", element: <ChangePasswordLazy /> },
        ],
    },
    {
        path: "/admin",
        element: (
            <ProtectedAdminRoute>
                <AdminLayout />
            </ProtectedAdminRoute>
        ),
        children: [
            { path: "products", element: <ProductManagementLazy /> },
            { path: "accounts", element: <UserListLazy /> },
            { path: "accounts/add", element: <AddInternalAccountLazy /> },
            { path: "accounts/edit/:id", element: <EditInternalAccountLazy /> },
            { path: "accounts/:id",
                element: <UserDetailsLazy />,
                children: [
                    { path: "orders", element: <OrderHistoryLazy /> },
                ],
            },
            { path: "products", element: <ProductManagementLazy /> },
            { path: "accounts/:id", element: <UserDetailsLazy /> },
            { path: "discounts", element: <DiscountListLazy /> },
            { path: "products/:productId", element: <ProductDetailAdminLazy /> },
            { path: "products/:productId/edit", element: <ProductEditLazy /> },
            { path:"/admin/settings/categories", element:<CategorySettingLazy />},
            { path:"/admin/settings/banners", element:<BannerSettingLazy />},
            { path:"/admin/settings/storeInformation", element:<StoreInformationLazy />},
            { path: "products/create", element: <ProductCreateLazy /> },
            { path: "collections", element: <CollectionManagementLazy /> },
            { path: "collections/create", element: <CollectionCreateLazy /> },
            { path: "collections/:id/edit", element: <CollectionEditLazy /> },
            { path: "collections/:id", element: <CollectionDetailLazy /> },
            { path: "dashboard", element: <DashboardLazy /> },
            { path: "orders", element: <OrderListLazy /> },
            { path: "orders/:orderId", element: <OrderDetailLazy /> },
            { path: "*", element: <NotFoundLazy /> },

        ],
    },
]);

export default router;


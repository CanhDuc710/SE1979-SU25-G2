import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import UserLayout from "../layout/UserLayout.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";

const HomepageLazy = lazy(() => import("../page/Home/Homepage.jsx"));
const ProductListLazy = lazy(() => import("../page/Product/ProductList.jsx"));
const ProductDetailLazy = lazy(() => import("../page/Product/ProductDetail.jsx"));
const CartPageLazy = lazy(() => import("../page/Cart/CartPage.jsx"));
const FAQLazy = lazy(() => import("../page/FAQ/FAQpage.jsx"));
const OrderPageLazy = lazy(() => import("../page/Order/OrderPage.jsx"));
const NotFoundLazy = lazy(() => import("../page/error/NotFound.jsx"));

// Admin pages
const ProductManagementLazy = lazy(() => import("../page/admin/product/productList.jsx"));
const UserListLazy = lazy(() => import("../page/admin/user_management/UserList.jsx"));
const UserDetailsLazy = lazy(() => import("../page/admin/user_management/UserDetail.jsx"));
const AddInternalAccountLazy = lazy(() => import("../page/admin/user_management/AddInternalAccount.jsx"));
const ProductDetailAdminLazy = lazy(() => import("../page/admin/product/ProductDetail.jsx"));
const ProductEditLazy = lazy(() => import("../page/admin/product/ProductEdit.jsx"));
const ProductCreateLazy = lazy(() => import("../page/admin/product/ProductCreate.jsx"));
const CollectionManagementLazy = lazy(() => import("../page/admin/collection/CollectionList.jsx"));
const CollectionDetailLazy = lazy(() => import("../page/admin/collection/CollectionDetail.jsx"));
const OrderListLazy = lazy(() => import("../page/admin/order_management/OrderList.jsx"));
const DiscountListLazy = lazy(() => import("../page/admin/discount/discountList.jsx"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        children: [
            { index: true, element: <HomepageLazy /> },
            { path: "products", element: <ProductListLazy /> },
            { path: "products/:productId", element: <ProductDetailLazy /> },
            { path: "cart", element: <CartPageLazy /> },
            { path: "faq", element: <FAQLazy /> },
            { path: "order", element: <OrderPageLazy /> },
            { path: "*", element: <NotFoundLazy /> }
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { path: "products", element: <ProductManagementLazy /> },
            { path: "accounts", element: <UserListLazy /> },
            { path: "accounts/add", element: <AddInternalAccountLazy /> },
            { path: "accounts/:id", element: <UserDetailsLazy /> },
            { path: "discounts", element: <DiscountListLazy /> },
            { path: "products/:productId", element: <ProductDetailAdminLazy /> },
            { path: "products/:productId/edit", element: <ProductEditLazy /> },
            { path: "products/create", element: <ProductCreateLazy /> },
            { path: "collections", element: <CollectionManagementLazy /> },
            { path: "collections/:id", element: <CollectionDetailLazy /> },
            { path: "orders", element: <OrderListLazy /> },
            { path: "*", element: <NotFoundLazy /> },
        ],
    },
]);

export default router;


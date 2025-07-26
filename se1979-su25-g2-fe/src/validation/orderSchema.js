import * as yup from "yup";

export const orderSchema = yup.object({
    shippingName: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên người nhận"),

    shippingPhone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^0[0-9]{8,10}$/, "Số điện thoại phải bắt đầu từ 0 và có 9–11 chữ số"),

    shippingAddress: yup
        .string()
        .trim()
        .required("Vui lòng nhập địa chỉ giao hàng"),

    provinceId: yup
        .number()
        .typeError("Vui lòng chọn tỉnh/thành")
        .required("Vui lòng chọn tỉnh/thành"),

    districtId: yup
        .number()
        .typeError("Vui lòng chọn quận/huyện")
        .required("Vui lòng chọn quận/huyện"),

    wardId: yup
        .number()
        .typeError("Vui lòng chọn phường/xã")
        .required("Vui lòng chọn phường/xã"),

    paymentMethod: yup
        .string()
        .oneOf(["COD", "CARD"], "Phương thức thanh toán không hợp lệ")
        .required("Vui lòng chọn phương thức thanh toán"),
});

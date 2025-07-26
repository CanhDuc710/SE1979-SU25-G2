import * as yup from "yup";

export const addressSchema = yup.object({
    recipientName: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên người nhận")
        .max(50, "Tên không vượt quá 50 ký tự"),

    recipientPhone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^0[0-9]{8,10}$/, "Số điện thoại phải bắt đầu từ 0 và có 9–11 chữ số"),

    addressLine: yup
        .string()
        .trim()
        .required("Vui lòng nhập địa chỉ cụ thể"),

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

    postalCode: yup
        .string()
        .nullable()
        .matches(/^\d{5,6}$/, "Mã bưu điện phải có 5–6 chữ số")
        .notRequired(),

    isDefault: yup.boolean()
});

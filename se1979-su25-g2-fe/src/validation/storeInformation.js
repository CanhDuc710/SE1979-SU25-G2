import * as yup from "yup";

const nonEmptyString = yup
    .string()
    // chuyển empty string thành null để các rule phía sau (url, matches) không chạy với ''
    .transform(value => (value === "" ? null : value))
    .nullable()
    .notRequired();

export const storeInformation = yup.object({
    storeName: yup
        .string()
        .required("Vui lòng nhập tên cửa hàng")
        .min(2, "Tên cửa hàng phải ít nhất 2 ký tự")
        .max(50, "Tên không vượt quá 50 ký tự"),

    email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),

    fanpage: nonEmptyString
        .url("URL fanpage không hợp lệ"),

    phone: nonEmptyString
        .matches(/^[0-9]{9,11}$/, {
            message: "Số điện thoại phải có 9–11 chữ số",
            excludeEmptyString: true,
        }),

    address: nonEmptyString,

    description: nonEmptyString,

    logo: yup
        .mixed()
        .nullable()
        .notRequired(),
});

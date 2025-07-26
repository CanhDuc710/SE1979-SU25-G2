// src/validation/registerSchema.js
import * as yup from "yup";

const nameRegex = /^[\p{L}\s]+$/u;

export const registerSchema = yup.object({
    firstName: yup
        .string()
        .trim()
        .required("Vui lòng nhập họ")
        .min(2, "Họ phải ít nhất 2 ký tự")
        .max(50, "Họ không vượt quá 50 ký tự")
        .matches(nameRegex, "Họ không được chứa số hoặc ký tự đặc biệt"),

    lastName: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên")
        .min(2, "Tên phải ít nhất 2 ký tự")
        .max(50, "Tên không vượt quá 50 ký tự")
        .matches(nameRegex, "Tên không được chứa số hoặc ký tự đặc biệt"),

    username: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên đăng nhập")
        .matches(/^[a-zA-Z0-9_]+$/, "Chỉ cho phép chữ, số và dấu gạch dưới")
        .min(4, "Tên đăng nhập ít nhất 4 ký tự")
        .max(15, "Tên đăng nhập không vượt quá 15 ký tự"),

    dob: yup
        .date()
        .nullable()
        .transform((value, original) => (original === "" ? null : value))
        .max(new Date(), "Ngày sinh không thể lớn hơn hôm nay"),

    sex: yup
        .string()
        .required("Vui lòng chọn giới tính")
        .oneOf(["MALE", "FEMALE", "OTHER"], "Chọn giới tính hợp lệ"),

    email: yup
        .string()
        .trim()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),

    phoneNumber: yup
        .string()
        .trim()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^0[0-9]{9,11}$/, "Số điện thoại phải 9–11 chữ số"),

    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .max(25, "Mật khẩu không vượt quá 25 ký tự"),

    confirmPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu")
        .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

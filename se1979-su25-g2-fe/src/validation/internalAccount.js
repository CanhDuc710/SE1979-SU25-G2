import * as yup from "yup";

const nameRegex = /^[\p{L}\s]+$/u;

export const accountSchema = yup.object({
    firstName: yup
        .string()
        .required("Vui lòng nhập tên")
        .min(2, "Tên phải ít nhất 2 ký tự")
        .max(50, "Tên không vượt quá 50 ký tự")
        .matches(nameRegex, "Tên không được chứa số hoặc ký tự đặc biệt"),
    lastName: yup
        .string()
        .required("Vui lòng nhập họ")
        .min(2, "Họ phải ít nhất 2 ký tự")
        .max(50, "Tên không vượt quá 50 ký tự")
        .matches(nameRegex, "Họ không được chứa số hoặc ký tự đặc biệt"),
    username: yup
        .string()
        .required("Vui lòng nhập tên tài khoản")
        .matches(/^[a-zA-Z0-9_]+$/, "Chỉ cho phép chữ, số và dấu gạch dưới")
        .min(4, "Username ít nhất 4 ký tự")
        .max(15, "Tên không vượt quá 15 ký tự"),
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu ít nhất 6 ký tự")
        .max(25, "Mật khẩu không vượt quá 25 ký tự"),
    email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ").nullable(),
    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^[0-9]{9,11}$/, "Số điện thoại phải 9–11 chữ số").nullable(),
    gender: yup
        .string()
        .oneOf(["MALE", "FEMALE", "OTHER"], "Chọn giới tính hợp lệ"),
    dob: yup
        .date()
        .required("Vui lòng chọn ngày sinh")
        .max(new Date(), "Ngày sinh không thể lớn hơn hôm nay").nullable(),
    role: yup
        .string()
        .oneOf(["STAFF", "ADMIN"], "Chọn vai trò hợp lệ"),
});

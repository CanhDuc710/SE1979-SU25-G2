import * as yup from "yup";

// Chỉ cho phép chữ (bao gồm unicode) và khoảng trắng
const nameRegex = /^[\p{L}\s]+$/u;

export const profileSchema = yup.object({
    firstName: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên")
        .min(2, "Tên phải ít nhất 2 ký tự")
        .max(50, "Tên không vượt quá 50 ký tự")
        .matches(nameRegex, "Tên không được chứa số hoặc ký tự đặc biệt"),

    lastName: yup
        .string()
        .trim()
        .required("Vui lòng nhập họ")
        .min(2, "Họ phải ít nhất 2 ký tự")
        .max(50, "Họ không vượt quá 50 ký tự")
        .matches(nameRegex, "Họ không được chứa số hoặc ký tự đặc biệt"),

    username: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên tài khoản")
        .matches(/^[a-zA-Z0-9_]+$/, "Chỉ cho phép chữ, số và dấu gạch dưới")
        .min(4, "Username ít nhất 4 ký tự")
        .max(15, "Username không vượt quá 15 ký tự"),

    password: yup
        .string()
        .transform((value) => {
            const val = (value ?? "").trim();
            return val === "" ? undefined : val;
        })
        .min(6, "Mật khẩu ít nhất 6 ký tự")
        .max(25, "Mật khẩu không vượt quá 25 ký tự")
        .notRequired(),

    email: yup
        .string()
        .trim()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),

    phoneNumber: yup
        .string()
        .trim()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^[0-9]{9,11}$/, "Số điện thoại phải 9–11 chữ số"),

    // Đổi sang 'sex' để khớp với formData.sex
    sex: yup
        .string()
        .required("Vui lòng chọn giới tính")
        .oneOf(["Male", "Female", "Other"], "Chọn giới tính hợp lệ"),

    dob: yup
        .date()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .max(new Date(), "Ngày sinh không thể lớn hơn hôm nay"),

    role: yup
        .string()
        .required("Vui lòng chọn vai trò")
        .oneOf(["STAFF", "ADMIN"], "Chọn vai trò hợp lệ"),
});

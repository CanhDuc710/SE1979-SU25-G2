import * as yup from "yup";

// Regex cho tên (chỉ chữ và khoảng trắng)
const nameRegex = /^[\p{L}\s]+$/u;

// Schema chung cho account
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
        .max(50, "Họ không vượt quá 50 ký tự")
        .matches(nameRegex, "Họ không được chứa số hoặc ký tự đặc biệt"),

    username: yup
        .string()
        .required("Vui lòng nhập tên tài khoản")
        .matches(/^[a-zA-Z0-9_]+$/, "Chỉ cho phép chữ, số và dấu gạch dưới")
        .min(4, "Username ít nhất 4 ký tự")
        .max(15, "Username không vượt quá 15 ký tự"),

    // Đối với edit: nếu password là chuỗi rỗng sẽ chuyển thành undefined, bỏ qua validate required
    password: yup
        .string()
        .transform((value) => {
            // Nếu người dùng không nhập password, treat as undefined
            const val = (value || "").trim();
            return val === "" ? undefined : val;
        })
        .min(6, "Mật khẩu ít nhất 6 ký tự")
        .max(25, "Mật khẩu không vượt quá 25 ký tự")
        .notRequired(),

    email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),

    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^[0-9]{9,11}$/, "Số điện thoại phải 9–11 chữ số"),

    phoneNumber: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^[0-9]{9,11}$/, "Số điện thoại phải 9–11 chữ số"),

    gender: yup
        .string()
        .oneOf(["MALE", "FEMALE", "OTHER"], "Chọn giới tính hợp lệ"),

    dob: yup
        .date()
        .nullable()
        .transform((value, originalValue) => {
            // Nếu giá trị gốc là chuỗi rỗng, chuyển thành null
            return originalValue === "" ? null : value;
        })
        .max(new Date(), "Ngày sinh không thể lớn hơn hôm nay"),

    role: yup
        .string()
        .oneOf(["STAFF", "ADMIN"], "Chọn vai trò hợp lệ"),
});

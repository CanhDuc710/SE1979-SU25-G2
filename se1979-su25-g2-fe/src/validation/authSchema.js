import * as yup from "yup";

// Reusable password rule
const passwordRule = yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .max(25, "Mật khẩu không vượt quá 25 ký tự");

// 1) Schema cho màn Quên mật khẩu (Chỉ email)
export const forgotPasswordSchema = yup.object({
    email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),
});

// 2) Schema cho màn Xác thực OTP & Đặt lại mật khẩu
export const otpResetSchema = yup.object({
    email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .length(6, "OTP gồm 6 ký tự"),
    newPassword: passwordRule,
    confirmPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu mới")
        .oneOf([yup.ref("newPassword")], "Mật khẩu không khớp"),
});

// 3) Schema cho màn Đổi mật khẩu (Đã đăng nhập)
export const changePasswordSchema = yup.object({
    currentPassword: passwordRule,
    newPassword: passwordRule,
    confirmPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu mới")
        .oneOf([yup.ref("newPassword")], "Mật khẩu không khớp"),
});

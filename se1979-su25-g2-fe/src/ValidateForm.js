export function validateAccountForm(data, { requirePassword = true } = {}) {
    const errors = {};

    // Họ và tên
    if (!data.firstName || data.firstName.trim() === "") {
        errors.firstName = "Vui lòng nhập tên";
    } else if (data.firstName.length > 50) {
        errors.firstName = "Tên không được vượt quá 50 ký tự";
    }

    if (!data.lastName || data.lastName.trim() === "") {
        errors.lastName = "Vui lòng nhập họ";
    } else if (data.lastName.length > 50) {
        errors.lastName = "Họ không được vượt quá 50 ký tự";
    }

    // Tên tài khoản
    if (!data.username || data.username.trim() === "") {
        errors.username = "Vui lòng nhập tên tài khoản";
    } else if (data.username.length > 50) {
        errors.username = "Tên tài khoản không được vượt quá 50 ký tự";
    }

    // Mật khẩu (tùy chỉnh theo Add/Edit)
    if (requirePassword) {
        if (!data.password || data.password.trim() === "") {
            errors.password = "Vui lòng nhập mật khẩu";
        } else if (data.password.length < 6) {
            errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }
    }

    // Email
    if (!data.email || data.email.trim() === "") {
        errors.email = "Vui lòng nhập email";
    } else if (data.email.length > 100) {
        errors.email = "Email không được vượt quá 100 ký tự";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Email không hợp lệ";
    }

    // Giới tính
    if (!data.gender || !["MALE", "FEMALE", "OTHER"].includes(data.gender)) {
        errors.gender = "Giới tính không hợp lệ";
    }

    // Vai trò
    if (!data.role || !["STAFF", "ADMIN"].includes(data.role)) {
        errors.role = "Vai trò không hợp lệ";
    }

    if (!data.phone || data.phone.trim() === "") {
        errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d+$/.test(data.phone)) {
        errors.phone = "Số điện thoại chỉ được chứa số";
    } else if (data.phone.length > 20 && data.phone.length < 9) {
        errors.phone = "Số điện thoại không được vượt quá 20 ký tự";
    }


    return errors;
}

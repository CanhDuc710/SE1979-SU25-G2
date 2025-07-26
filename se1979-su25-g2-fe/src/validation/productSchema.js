import * as yup from "yup";

export const productSchema = yup.object({
    productCode: yup
        .string()
        .trim()
        .required("Vui lòng nhập mã sản phẩm")
        .matches(/^[A-Za-z0-9_-]+$/, "Mã chỉ được chứa chữ, số, _ hoặc -")
        .max(30, "Mã không quá 30 ký tự"),

    name: yup
        .string()
        .trim()
        .required("Vui lòng nhập tên sản phẩm")
        .max(100, "Tên không quá 100 ký tự"),

    description: yup
        .string()
        .trim()
        .max(1000, "Mô tả không quá 1000 ký tự")
        .nullable(),

    categoryId: yup
        .number()
        .transform((value, original) =>
            original === "" ? undefined : Number(original)
        )
        .typeError("Vui lòng chọn danh mục")
        .required("Vui lòng chọn danh mục"),

    brand: yup
        .string()
        .trim()
        .required("Vui lòng nhập thương hiệu")
        .max(50, "Thương hiệu không quá 50 ký tự"),

    material: yup
        .string()
        .trim()
        .max(50, "Chất liệu không quá 50 ký tự")
        .nullable(),

    gender: yup
        .string()
        .required("Vui lòng chọn giới tính")
        .oneOf(["MALE", "FEMALE", "UNISEX"], "Giới tính không hợp lệ"),

    price: yup
        .number()
        .typeError("Vui lòng nhập giá hợp lệ")
        .required("Vui lòng nhập giá")
        .positive("Giá phải lớn hơn 0"),

    isActive: yup
        .boolean()
        .required()
});

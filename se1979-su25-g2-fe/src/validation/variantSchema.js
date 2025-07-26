import * as yup from "yup";

const lettersOnlyRegex = /^[\p{L}\s]+$/u;

export const variantSchema = yup.object({
    color: yup
        .string()
        .trim()
        .required("Vui lòng nhập màu")
        .matches(lettersOnlyRegex, "Màu chỉ được chứa chữ và khoảng trắng")
        .max(30, "Màu không quá 30 ký tự"),
    size: yup
        .string()
        .trim()
        .required("Vui lòng nhập size")
        .max(10, "Size không quá 10 ký tự"),
    stockQuantity: yup
        .number()
        .typeError("Số lượng phải là số")
        .required("Vui lòng nhập số lượng tồn kho")
        .integer("Số lượng phải là số nguyên"),
    isActive: yup
        .boolean()
        .required()
});

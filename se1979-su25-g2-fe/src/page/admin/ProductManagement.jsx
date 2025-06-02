import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";

//Sample data
const productsData = [
    {
        id: 1,
        image: "https://via.placeholder.com/60x60?text=T1",
        name: "T-Shirt Groot Black",
        brand: "Diorr",
        category: "T-Shirt",
        price: "300.000 VND",
        discount: "15%",
        stock: 200,
        status: "Active",
    },
    {
        id: 2,
        image: "https://via.placeholder.com/60x60?text=Sepatu",
        name: "Sepatu Nike",
        brand: "Nokie",
        category: "Shoe",
        price: "300.000 VND",
        discount: "15%",
        stock: 0,
        status: "Out of Stock",
    },
    {
        id: 3,
        image: "https://via.placeholder.com/60x60?text=T2",
        name: "T-Shirt Love Kills",
        brand: "Polaf",
        category: "T-Shirt",
        price: "300.000 VND",
        discount: "15%",
        stock: 120,
        status: "Inactive",
    },
    {
        id: 4,
        image: "https://via.placeholder.com/60x60?text=Tas",
        name: "Tas Selempang Pria",
        brand: "Polaf",
        category: "Bag",
        price: "300.000 VND",
        discount: "15%",
        stock: 50,
        status: "Active",
    },
    {
        id: 5,
        image: "https://via.placeholder.com/60x60?text=T2",
        name: "T-Shirt Love Kills",
        brand: "Polaf",
        category: "T-Shirt",
        price: "300.000 VND",
        discount: "15%",
        stock: 120,
        status: "Inactive",
    },
    {
        id: 6,
        image: "https://via.placeholder.com/60x60?text=T1",
        name: "T-Shirt Groot Black",
        brand: "Diorr",
        category: "T-Shirt",
        price: "300.000 VND",
        discount: "15%",
        stock: 200,
        status: "Active",
    },
    {
        id: 7,
        image: "https://via.placeholder.com/60x60?text=Sepatu",
        name: "Sepatu Nike",
        brand: "Nokie",
        category: "Shoe",
        price: "300.000 VND",
        discount: "15%",
        stock: 0,
        status: "Out of Stock",
    },
    {
        id: 8,
        image: "https://via.placeholder.com/60x60?text=T2",
        name: "T-Shirt Love Kills",
        brand: "Polaf",
        category: "T-Shirt",
        price: "300.000 VND",
        discount: "15%",
        stock: 120,
        status: "Inactive",
    },
    {
        id: 9,
        image: "https://via.placeholder.com/60x60?text=Tas",
        name: "Tas Selempang Pria",
        brand: "Polaf",
        category: "Bag",
        price: "300.000 VND",
        discount: "15%",
        stock: 50,
        status: "Active",
    },
    {
        id: 10,
        image: "https://via.placeholder.com/60x60?text=T2",
        name: "T-Shirt Love Kills",
        brand: "Polaf",
        category: "T-Shirt",
        price: "300.000 VND",
        discount: "15%",
        stock: 120,
        status: "Inactive",
    },
    {
        id: 11,
        image: "https://via.placeholder.com/60x60?text=Sepatu",
        name: "Sepatu Nike",
        brand: "Nokie",
        category: "Shoe",
        price: "300.000 VND",
        discount: "15%",
        stock: 0,
        status: "Out of Stock",
    },
];

//Số product 1 trang
const PRODUCTS_PER_PAGE = 5;

export default function ProductManagement() {
    // Trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // Tống số trang
    const totalPages = Math.ceil(productsData.length / PRODUCTS_PER_PAGE);

    // Lấy dữ liệu sản phẩm cho trang hiện tại
    const products = productsData.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    // Hàm tạo style cho Status
    const getStatusStyle = (status) => {
        switch (status) {
            case "Active":
            case "Inactive":
            case "Out of Stock":
                return { color: "#1E40AF", cursor: "pointer", textDecoration: "underline" };
            default:
                return {};
        }
    };

    // Hàm render các nút trang
    const renderPageButtons = () => {
        const buttons = [];

        //Nút trước
        buttons.push(
            <button
                key="prev"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                //Nếu trang hien tai la 1 thi nút truoc bi disable
                disabled={currentPage === 1}
                style={{
                    backgroundColor: "#000",
                    color: "#ccc",
                    borderRadius: 6,
                    border: "none",
                    padding: "0 12px",
                    height: 40,
                    fontWeight: "bold",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
            >
                Trước
            </button>
        );

        // Các nút số trang (có thể tùy chỉnh hiện ... khi nhiều trang)
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    style={{
                        backgroundColor: i === currentPage ? "#3b82f6" : "#000",
                        color: i === currentPage ? "#fff" : "#ccc",
                        borderRadius: 6,
                        border: "none",
                        width: 40,
                        height: 40,
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    {i}
                </button>
            );
        }

        // Nút Sau
        buttons.push(
            <button
                key="next"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                    backgroundColor: "#000",
                    color: "#ccc",
                    borderRadius: 6,
                    border: "none",
                    width: 60,
                    height: 40,
                    fontWeight: "bold",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
            >
                Sau
            </button>
        );

        return buttons;
    };

    return (
        <AdminLayout activeMenu="Product Management">
            <h2 style={{ marginBottom: 20 }}>Product Management</h2>

            <button
                style={{
                    backgroundColor: "#bbb",
                    color: "#333",
                    padding: "6px 16px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    marginBottom: 20,
                }}
            >
                Add Product
            </button>

            {/* Tìm kiếm và lọc... (giữ nguyên) */}

            <div
                style={{
                    backgroundColor: "#c0c0c0",
                    borderRadius: 10,
                    padding: 20,
                    overflowX: "auto",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0 12px",
                        backgroundColor: "#c0c0c0",
                    }}
                >
                    <thead>
                    <tr>
                        {["Product", "Brand", "Category", "Price", "Discount", "Stock", "Status", "Action"].map(
                            (heading) => (
                                <th
                                    key={heading}
                                    style={{
                                        padding: "12px 15px",
                                        textAlign: "left",
                                        fontWeight: "bold",
                                        color: "#444",
                                        fontSize: 14,
                                    }}
                                >
                                    {heading}
                                </th>
                            )
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(
                        ({ id, image, name, brand, category, price, discount, stock, status }) => (
                            <tr
                                key={id}
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: 10,
                                    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                                    verticalAlign: "middle",
                                }}
                            >
                                <td style={{ padding: "10px 15px", display: "flex", alignItems: "center", gap: 15 }}>
                                    <img
                                        src={image}
                                        alt={name}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 12,
                                            objectFit: "cover",
                                            boxShadow: "0 0 5px rgba(0,0,0,0.15)",
                                        }}
                                    />
                                    <span style={{ fontSize: 14, fontWeight: "600" }}>{name}</span>
                                </td>
                                <td style={{ padding: "10px 15px", fontSize: 14 }}>{brand}</td>
                                <td style={{ padding: "10px 15px", fontSize: 14 }}>{category}</td>
                                <td style={{ padding: "10px 15px", fontSize: 14 }}>{price}</td>
                                <td style={{ padding: "10px 15px", fontSize: 14 }}>{discount}</td>
                                <td style={{ padding: "10px 15px", fontSize: 14 }}>{stock}</td>
                                <td style={{ padding: "10px 15px", fontSize: 14, ...getStatusStyle(status) }}>{status}</td>
                                <td style={{ padding: "10px 15px", fontSize: 16, cursor: "pointer" }}>
                                    <span style={{ marginRight: 12 }}>✏️</span>
                                    <span>🗑️</span>
                                </td>
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    marginTop: 25,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 14,
                    color: "#555",
                }}
            >
                <div style={{ display: "flex", gap: 8 }}>
                    {renderPageButtons()}
                </div>
                <div>
                    Hiển thị {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-
                    {Math.min(currentPage * PRODUCTS_PER_PAGE, productsData.length)} trên {productsData.length} mục
                </div>
            </div>
        </AdminLayout>
    );
}

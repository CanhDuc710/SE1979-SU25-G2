import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductsPaged } from '../../service/productService';
import ProductCard from './ProductCard';
import SidebarFilter from '../../ui/SidebarFilter';
import Pagination from '../../ui/Pagination';
import { IMAGE_BASE_URL } from '../../utils/constants';
import { Link } from "react-router-dom";

export default function ProductList() {
    const { searchKeyword } = useOutletContext(); // 💥 Bắt buộc phải có
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({ name: searchKeyword });

    useEffect(() => {
        const appliedFilters = {
            ...filters,
            name: searchKeyword || undefined,
        };

        Object.keys(appliedFilters).forEach((key) => {
            if (!appliedFilters[key]) {
                delete appliedFilters[key];
            }
        });

        fetchProductsPaged(page, 8, appliedFilters)
            .then((data) => {
                console.log("✅ API result:", data.content);
                setProducts(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(console.error);
    }, [page, searchKeyword, filters]);



    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <main className="flex container mx-auto mt-6">
            <SidebarFilter onFilterChange={setFilters} />
            <section className="flex-1 px-6">
                <h2 className="text-xl font-semibold mb-4">
                    {searchKeyword ? `Kết quả cho "${searchKeyword}"` : "Gợi ý cho bạn"}
                </h2>
                <div className="grid grid-cols-4 gap-4">
                    {products.map((item) => (
                        <Link
                            to={`/products/${item.productId}`}
                            key={item.productId}
                            className="block"
                        >
                            <ProductCard
                                name={item.name}
                                price={item.price + " VND"}
                                image={
                                    item.imageUrls.length > 0
                                        ? `${IMAGE_BASE_URL}${item.imageUrls[0]}`
                                        : null
                                }
                            />
                        </Link>
                    ))}
                </div>
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </section>
        </main>
    );
}

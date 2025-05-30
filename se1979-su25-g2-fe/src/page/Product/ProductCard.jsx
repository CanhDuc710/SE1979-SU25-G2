export default function ProductCard({ name, price, image }) {
    return (
        <div className="border rounded p-4 hover:shadow-md transition bg-white">
            <div className="w-full h-48 bg-gray-100 mb-4 flex items-center justify-center overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="object-cover h-full w-full" />
                ) : (
                    <span className="text-gray-500">No Image</span>
                )}
            </div>
            <h3 className="text-sm font-semibold mb-1">{name}</h3>
            <p className="text-red-500 text-sm">{price}</p>
        </div>
    );
}

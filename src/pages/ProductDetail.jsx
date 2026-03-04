import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Product Detail</h1>
      <p className="text-gray-600 text-sm">Product id: {id}</p>
      <p className="text-gray-500 text-sm mt-2">
        Product detail content will be added later.
      </p>
    </div>
  );
}

export default ProductDetail;


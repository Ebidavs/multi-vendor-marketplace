import {useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ProductForm from "../../components/dashboard/ProductForm";
import "./vendor.css";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "Wireless Headphones",
    category: "electronics",
    description: "Premium wireless headphones with clear sound and comfortable ear cushions.",
    price: "45000",
    stock: "25",
  });

  const [images, setImages] = useState([]);

  // Temporary categories.
  // These will later come from GET /api/v1/categories.
  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home", name: "Home & Living" },
    { id: "beauty", name: "Beauty" },
    { id: "sports", name: "Sports" },
    { id: "food", name: "Food & Groceries" },
  ];



  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    setImages((previousImages) => {
      const combinedImages = [
        ...previousImages,
        ...selectedFiles,
      ];

      return combinedImages.slice(0, 5);
    });

    event.target.value = "";
  };

  const removeImage = (imageIndex) => {
    setImages((previousImages) =>
      previousImages.filter(
        (_, index) => index !== imageIndex
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const productData = new FormData();

    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("stock", formData.stock);
    productData.append("category", formData.category);

    // Images are optional when editing.
    // If new images are selected, the backend replaces the old images.
    images.forEach((image) => {
      productData.append("images", image);
    });

    console.log("Editing product:", id);

    for (const [key, value] of productData.entries()) {
      console.log(key, value);
    }

    alert("Product update is ready for backend submission.");
  };

  return (
    <DashboardLayout role="vendor">
      <section className="add-product-page">
        <div className="add-product-header">
          <div className="add-product-heading">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/vendor/products")}
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>Edit Product</h1>
              <p>
                Update your product information, pricing,
                stock and images.
              </p>
            </div>
          </div>
        </div>

        <ProductForm
          formData={formData}
          onChange={handleChange}
          images={images}
          onImagesChange={handleImagesChange}
          onRemoveImage={removeImage}
          onSubmit={handleSubmit}
          categories={categories}
          submitText="Save Changes"
          title="Product Information"
          description="Update the information about your product."
        />
      </section>
    </DashboardLayout>
  );
}

export default EditProduct;
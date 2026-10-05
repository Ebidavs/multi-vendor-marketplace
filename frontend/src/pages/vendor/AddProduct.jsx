import {
  useEffect,
  useState,
} from "react";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ProductForm from "../../components/dashboard/ProductForm";

import {
  createProduct,
  getCategories,
} from "../../services/api";

import "./vendor.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();

        setCategories(response.data || []);
      } catch (err) {
        console.error(
          "Failed to load categories:",
          err
        );

        setError(
          "Unable to load product categories."
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files
    );

    setImages((previous) =>
      [...previous, ...selectedFiles].slice(0, 5)
    );

    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (images.length === 0) {
      setError(
        "Please select at least one product image."
      );

      return;
    }

    if (!formData.category) {
      setError(
        "Please select a product category."
      );

      return;
    }

    const productData = new FormData();

    productData.append("name", formData.name);
    productData.append(
      "description",
      formData.description
    );
    productData.append("price", formData.price);
    productData.append("stock", formData.stock);
    productData.append(
      "category",
      formData.category
    );

    images.forEach((image) => {
      productData.append("images", image);
    });

    try {
      setLoading(true);

      const response = await createProduct(
        productData
      );

      console.log(
        "Product created:",
        response
      );

      alert("Product created successfully.");

      navigate("/vendor/products");
    } catch (err) {
      console.error(
        "Create product error:",
        err
      );

      setError(
        err.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="vendor">
      <section className="add-product-page">
        <div className="dashboard-page-heading">
          <div>
            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/vendor/products")
              }
            >
              <ArrowLeft size={18} />
              Back to Products
            </button>

            <h1>Add Product</h1>

            <p>
              Add a new product to your store.
            </p>
          </div>
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : (
          <ProductForm
            formData={formData}
            onChange={handleChange}
            images={images}
            onImagesChange={
              handleImagesChange
            }
            onRemoveImage={removeImage}
            onSubmit={handleSubmit}
            categories={categories}
            submitText={
              loading
                ? "Creating Product..."
                : "Create Product"
            }
            title="Product Information"
            description="Enter the details of the product you want to sell."
          />
        )}
      </section>
    </DashboardLayout>
  );
}

export default AddProduct;
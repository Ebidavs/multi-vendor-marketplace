import {
  useEffect,
  useState,
} from "react";

import { ArrowLeft } from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ProductForm from "../../components/dashboard/ProductForm";

import {
  getCategories,
  getProductById,
  updateProduct,
} from "../../services/api";

import "./vendor.css";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setError("");
        setPageLoading(true);

        const [
          productResponse,
          categoriesResponse,
        ] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        const product =
          productResponse.data?.product;

        if (!product) {
          throw new Error(
            "Product could not be found."
          );
        }

        setFormData({
          name: product.name || "",
          category:
            product.categoryId || "",
          description:
            product.description || "",
          price:
            product.price?.toString() ||
            "",
          stock:
            product.stockQuantity?.toString() ||
            "0",
        });

        setExistingImages(
          product.images || []
        );

        setCategories(
          categoriesResponse.data || []
        );
      } catch (err) {
        console.error(
          "Load product error:",
          err
        );

        setError(
          err.message ||
            "Failed to load product."
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

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
      [
        ...previous,
        ...selectedFiles,
      ].slice(0, 5)
    );

    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!formData.category) {
      setError(
        "Please select a product category."
      );

      return;
    }

    const productData =
      new FormData();

    productData.append(
      "name",
      formData.name
    );

    productData.append(
      "description",
      formData.description
    );

    productData.append(
      "price",
      formData.price
    );

    productData.append(
      "stock",
      formData.stock
    );

    productData.append(
      "category",
      formData.category
    );

    /*
      Images are optional when updating.

      If the vendor selects new images,
      the backend replaces the existing
      product images with these new ones.

      If no new images are selected,
      the existing images remain unchanged.
    */
    images.forEach((image) => {
      productData.append(
        "images",
        image
      );
    });

    try {
      setLoading(true);

      const response =
        await updateProduct(
          id,
          productData
        );

      console.log(
        "Product updated:",
        response
      );

      alert(
        "Product updated successfully."
      );

      navigate(
        "/vendor/products"
      );
    } catch (err) {
      console.error(
        "Update product error:",
        err
      );

      setError(
        err.message ||
          "Failed to update product."
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
                navigate(
                  "/vendor/products"
                )
              }
            >
              <ArrowLeft size={18} />
              Back to Products
            </button>

            <h1>Edit Product</h1>

            <p>
              Update your product
              information.
            </p>
          </div>
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {pageLoading ? (
          <p>Loading product...</p>
        ) : (
          <>
            {existingImages.length >
              0 && (
              <div className="existing-product-images">
                <p>
                  Current product images
                </p>

                <div className="existing-images-grid">
                  {existingImages.map(
                    (
                      image,
                      index
                    ) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`Current product ${
                          index + 1
                        }`}
                      />
                    )
                  )}
                </div>

                <small>
                  Select new images only
                  if you want to replace
                  the current product
                  images.
                </small>
              </div>
            )}

            <ProductForm
              formData={formData}
              onChange={handleChange}
              images={images}
              onImagesChange={
                handleImagesChange
              }
              onRemoveImage={
                removeImage
              }
              onSubmit={
                handleSubmit
              }
              categories={
                categories
              }
              submitText={
                loading
                  ? "Saving Changes..."
                  : "Save Changes"
              }
              title="Product Information"
              description="Update the details of your product."
            />
          </>
        )}
      </section>
    </DashboardLayout>
  );
}

export default EditProduct;
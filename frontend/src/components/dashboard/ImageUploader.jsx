import {
  UploadCloud,
  Image,
  X,
} from "lucide-react";

function ImageUploader({
  images = [],
  onImagesChange,
  onRemoveImage,
}) {
  return (
    <section className="product-form-card">
      <div className="form-card-heading">
        <h2>Product Images</h2>

        <p>
          Upload clear images of your product.
        </p>
      </div>

      <div className="form-card-content">
        <label className="image-upload-area">
          <UploadCloud size={35} />

          <strong>Upload product images</strong>

          <span>
            PNG, JPG or JPEG — maximum 5 images
          </span>

          <span className="upload-button-text">
            Choose Images
          </span>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImagesChange}
            hidden
          />
        </label>

        {images.length > 0 && (
          <div className="selected-images-list">
            {images.map((file, index) => (
              <div
                className="selected-image"
                key={`${file.name}-${index}`}
              >
                <div className="selected-image-icon">
                  <Image size={28} />
                </div>

                <div>
                  <strong>{file.name}</strong>
                  <span>Image selected</span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={17} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ImageUploader;
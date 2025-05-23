import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Product } from "../models/Product";
import toast from "react-hot-toast";
import "../AllProduct.css";
import { useTranslation } from "react-i18next";

interface ProductFormData {
  category: string;
  title: string;
  description: string;
  price: string;
  salePrice: string;
  discountPercentage: string;
  stock: string;
  brand: string;
  rating: string;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 700 * 1024; // 700KB

const AddProduct = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    category: "",
    title: "",
    description: "",
    price: "",
    salePrice: "0",
    discountPercentage: "0",
    stock: "",
    brand: "",
    rating: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const language = localStorage.getItem("language") || "en";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get<{ name: string }[]>("/category/list");
        const categoryNames = res.data.map((cat) => cat.name);
        setCategories(categoryNames);
      } catch (error) {
        toast.error(t("addProductError"));
        console.error(error);
      }
    };
    fetchCategories();
  }, [t]);

  useEffect(() => {
    const price = parseFloat(formData.price || "0");
    const discount = parseFloat(formData.discountPercentage || "0");

    if (!isNaN(price) && price > 0) {
      const salePrice = discount === 0 ? price : price - (price * discount) / 100;
      setFormData((prev) => ({
        ...prev,
        salePrice: salePrice.toFixed(2),
      }));
    }
  }, [formData.price, formData.discountPercentage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle multiple image selection at once
  // const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files) return;

  //   const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  //   const newFiles: File[] = [];
  //   let hasError = false;

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     if (!validTypes.includes(file.type)) {
  //       toast.error(t("invalidImageType"));
  //       hasError = true;
  //       break;
  //     }
  //     if (file.size > MAX_IMAGE_SIZE) {
  //       toast.error(t("maxImageLimit"));
  //       hasError = true;
  //       break;
  //     }
  //     newFiles.push(file);
  //   }

  //   if (hasError || newFiles.length + images.length > MAX_IMAGES) {
  //     if (!hasError) toast.error(t("maxImagesAllowed"));
  //     setImages([]);
  //     setImagePreviews([]);
  //     setImageError(t("imageUploadError"));
  //     if (fileInputRef.current) fileInputRef.current.value = "";
  //     return;
  //   }

  //   setImageError("");
  //   const updatedImages = [...images, ...newFiles];
  //   setImages(updatedImages);

  //   const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
  //   setImagePreviews((prev) => [...prev, ...newPreviews]);

  //   // Reset input so same files can be picked again
  //   if (fileInputRef.current) fileInputRef.current.value = "";
  // };
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const newFiles: File[] = [];
    let errorMessage = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!validTypes.includes(file.type)) {
        errorMessage = t("invalidImageType");
        break;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        errorMessage = t("maxImageLimit");
        break;
      }

      newFiles.push(file);
    }

    if (errorMessage || newFiles.length + images.length > MAX_IMAGES) {
      if (!errorMessage) errorMessage = t("maxImagesAllowed");

      // Clear chosen files and error state
      setImages([]);
      setImagePreviews([]);
      setImageError(errorMessage);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Valid input
    setImageError("");
    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset input value to allow reselecting same files
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (imageError) setImageError("");
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {};
    const price = parseFloat(formData.price);
    const salePrice = parseFloat(formData.salePrice);
    const stock = parseInt(formData.stock);
    const rating = parseFloat(formData.rating);

    if (!formData.category) errors.category = "categoryRequired";
    if (!formData.title || formData.title.trim() === "") {
      errors.title = "titleRequired";
    } else if (formData.title.trim().length < 3) {
      errors.title = "titleMinLength";
    }
    if (!formData.price || price <= 0) errors.price = "priceRequired";
    if (!formData.stock || stock < 0) errors.stock = "stockRequired";
    if (!formData.brand.trim()) errors.brand = "brandRequired";
    if (formData.salePrice && salePrice > price) {
      errors.salePrice = "salePriceInvalid";
    }
    if (formData.rating && (rating < 0 || rating > 5)) {
      errors.rating = "ratingInvalid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || imageError) return;

    setLoading(true);
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (["price", "salePrice", "discountPercentage", "stock", "rating"].includes(key)) {
        const parsedValue = parseFloat(value);
        data.append(key, isNaN(parsedValue) ? "0" : String(parsedValue));
      } else {
        data.append(key, value);
      }
    });

    images.forEach((img) => {
      if (img) data.append("images", img);
    });

    try {
      const res = await axiosInstance.post<{ message: string; product: Product }>("/products/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept-Language": language,
        },
      });

      toast.success(res.data.message);
      setFormData({
        category: "",
        title: "",
        description: "",
        price: "",
        salePrice: "0",
        discountPercentage: "0",
        stock: "",
        brand: "",
        rating: "",
      });
      setImages([]);
      setImagePreviews([]);
      setImageError("");
      setFormErrors({});
    } catch (error: unknown) {
      toast.error(t("addProductError"));
      console.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <form onSubmit={handleSubmit} className="add-product-form" encType="multipart/form-data">
        <h2>{t("addProductTitle")}</h2>

        <div className="form-group">
          <label>{t("categoryLabel")} *</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">{t("selectCategory")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {formErrors.category && <p className="error">{t(formErrors.category)}</p>}
        </div>

        <div className="form-group">
          <label>{t("titleLabel")} *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          {formErrors.title && <p className="error">{t(formErrors.title)}</p>}
        </div>

        <div className="form-group">
          <label>{t("descriptionLabel")}</label>
          <textarea name="description" rows={3} value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>{t("priceLabel")} (₹) *</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          {formErrors.price && <p className="error">{t(formErrors.price)}</p>}
        </div>

        <div className="form-group">
          <label>{t("salePriceLabel")}</label>
          <input type="number" name="salePrice" value={formData.salePrice} disabled />
        </div>

        <div className="form-group">
          <label>{t("discountLabel")}</label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>{t("stockLabel")} *</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          {formErrors.stock && <p className="error">{t(formErrors.stock)}</p>}
        </div>

        <div className="form-group">
          <label>{t("brandLabel")} *</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
          {formErrors.brand && <p className="error">{t(formErrors.brand)}</p>}
        </div>

        <div className="form-group">
          <label>{t("imagesLabel")}</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            onChange={handleImagesChange}
            ref={fileInputRef}
          />
          {imageError && <p className="error">{imageError}</p>}

          {/* Preview thumbnails */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
            {imagePreviews.map((src, index) => (
              <div key={index} style={{ position: "relative" }}>
                <div style={{ position: "relative", width: 80, height: 80 }}>
                  <img
                    src={src}
                    alt={`preview ${index + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 128, 0, 0.7)",
                      borderRadius: "0 0 0 8px",
                      color: "white",
                      fontSize: 14,
                      padding: "2px 6px",
                    }}
                  >
                    ✓
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                  }}
                  aria-label={t("removeImageButton")}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? t("creating") : t("createProduct")}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

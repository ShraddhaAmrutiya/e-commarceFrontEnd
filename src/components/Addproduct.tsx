import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../models/Product";
import toast from "react-hot-toast";
import "../AllProduct.css";

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

const AddProduct = () => {
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
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [imageError, setImageError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const MAX_IMAGE_SIZE = 700 * 1024; // 700KB

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<{ name: string }[]>("/category/list");
        const categoryNames = res.data.map((cat) => cat.name);
        setCategories(categoryNames);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

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

  const handleAddImageInput = () => {
    setImages((prev) => [...prev, null]);
  };

  const handleRemoveImageInput = (index: number) => {
    if (images.length === 1) return;

    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      // Clear image error if we drop below the limit
      if (updated.length < 5) {
        setImageError("");
      }

      return updated;
    });
  };

  const handleImageChange = (index: number, file: File | null) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file && !validTypes.includes(file.type)) {
      setImageError("Invalid image type. Only JPG, JPEG, or PNG are allowed.");
      return;
    } else if (file && file.size > MAX_IMAGE_SIZE) {
      setImageError(`Image size exceeds the ${(MAX_IMAGE_SIZE / 1024).toFixed(0)}KB limit.`);
      return;
    }

    setImageError("");
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {};
    const price = parseFloat(formData.price);
    const salePrice = parseFloat(formData.salePrice);
    const stock = parseInt(formData.stock);
    const rating = parseFloat(formData.rating);

    if (!formData.category) errors.category = "Category is required";
    if (!formData.title || formData.title.trim() === "") {
      errors.title = "Title is required.";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title should be at least 3 characters long.";
    }
    if (!formData.price || price <= 0) errors.price = "Valid price is required";
    if (!formData.stock || stock < 0) errors.stock = "Stock is required";
    if (!formData.brand.trim()) errors.brand = "Brand is required";
    if (formData.salePrice && salePrice > price) {
      errors.salePrice = "Sale price cannot be greater than original price";
    }
    if (formData.rating && (rating < 0 || rating > 5)) {
      errors.rating = "Rating must be between 0 and 5";
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
      const res = await axios.post<{ message: string; product: Product }>("/products/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
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
      setImages([null]);
      setImageError("");
      setFormErrors({});
    } catch (error: unknown) {
      toast.error("Error in adding product");
      console.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <form onSubmit={handleSubmit} className="add-product-form" encType="multipart/form-data">
        <h2>Add Product</h2>

        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {formErrors.category && <p className="error">{formErrors.category}</p>}
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          {formErrors.title && <p className="error">{formErrors.title}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows={3} value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Price (₹) *</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          {formErrors.price && <p className="error">{formErrors.price}</p>}
        </div>

        <div className="form-group">
          <label>Sale Price (auto-calculated)</label>
          <input type="number" name="salePrice" value={formData.salePrice} disabled />
        </div>

        <div className="form-group">
          <label>Discount % (optional)</label>
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
          <label>Stock *</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          {formErrors.stock && <p className="error">{formErrors.stock}</p>}
        </div>

        <div className="form-group">
          <label>Brand *</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
          {formErrors.brand && <p className="error">{formErrors.brand}</p>}
        </div>

        <div className="form-group">
          <label>Rating (0 to 5)</label>
          <input type="number" name="rating" value={formData.rating} onChange={handleChange} />
          {formErrors.rating && <p className="error">{formErrors.rating}</p>}
        </div>

        <div className="form-group">
          <label>Images</label>
          {images.map((_img, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveImageInput(index)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {imageError && <p className="error">{imageError}</p>}

          <button
            type="button"
            onClick={() => {
              if (images.length >= 5) {
                setImageError("You can add only 5 images.");
                return;
              }
              // Clear error when adding a new image below limit
              setImageError(""); 
              handleAddImageInput();
            }}
            disabled={false}
          >
            Add More Images
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

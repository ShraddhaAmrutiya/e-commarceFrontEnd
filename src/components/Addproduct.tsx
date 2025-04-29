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
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>(""); 
  const [loading, setLoading] = useState(false);

  const MAX_IMAGE_SIZE = 200 * 1024 ; // 200kb

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setImageError("Invalid image type. Only JPG, JPEG, or PNG are allowed.");
        setImage(null); 
      }
      else if (file.size > MAX_IMAGE_SIZE) {
        setImageError(`Image size exceeds the ${MAX_IMAGE_SIZE / 1024 }MB limit.`);
        setImage(null); 
      } else {
        setImageError(""); 
        setImage(file);
      }
    }
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
    
    if (!validateForm() || imageError) return; // Prevent submit if there are errors

    setLoading(true);
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (["price", "salePrice", "discountPercentage", "stock", "rating"].includes(key)) {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
          data.append(key, String(parsedValue));
        } else {
          data.append(key, "0");
        }
      } else {
        data.append(key, value);
      }
    });

    if (image) {
      data.append("image", image);
    }

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
      setImage(null);
      setImageError(""); // Reset image error
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
          <label>
            Category <span style={{ color: "red" }}>*</span>
          </label>
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
          <label>
            Title <span style={{ color: "red" }}>*</span>
          </label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          {formErrors.title && <p className="error">{formErrors.title}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows={3} value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            Price (₹) <span style={{ color: "red" }}>*</span>
          </label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          {formErrors.price && <p className="error">{formErrors.price}</p>}
        </div>

        <div className="form-group">
          <label>Sale Price (auto-calculated)</label>
          <input type="number" name="salePrice" value={formData.salePrice} disabled />
        </div>

        <div className="form-group">
          <label>
            Discount % <span style={{ color: "gray" }}>(optional)</span>
          </label>
          <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} min="0" max="100" />
          {formErrors.discountPercentage && <p className="error">{formErrors.discountPercentage}</p>}
        </div>

        <div className="form-group">
          <label>
            Stock <span style={{ color: "red" }}>*</span>
          </label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          {formErrors.stock && <p className="error">{formErrors.stock}</p>}
        </div>

        <div className="form-group">
          <label>
            Brand <span style={{ color: "red" }}>*</span>
          </label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
          {formErrors.brand && <p className="error">{formErrors.brand}</p>}
        </div>

        <div className="form-group">
          <label>Rating (0 to 5)</label>
          <input type="number" name="rating" value={formData.rating} onChange={handleChange} />
          {formErrors.rating && <p className="error">{formErrors.rating}</p>}
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
          {imageError && <p className="error">{imageError}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

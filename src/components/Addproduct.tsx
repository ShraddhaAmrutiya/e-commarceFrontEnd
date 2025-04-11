import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Product } from "../models/Product";
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
    salePrice: "",
    discountPercentage: "",
    stock: "",
    brand: "",
    rating: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") {
        if (["price", "salePrice", "discountPercentage", "stock", "rating"].includes(key)) {
          data.append(key, String(parseFloat(value)));
        } else {
          data.append(key, value);
        }
      }
    });

    if (image) {
      data.append("image", image);
    }

    try {
      const res = await axios.post<{ message: string; product: Product }>("/products/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      setFormData({
        category: "",
        title: "",
        description: "",
        price: "",
        salePrice: "",
        discountPercentage: "",
        stock: "",
        brand: "",
        rating: "",
      });
      setImage(null);
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

        {/* ✅ Category Dropdown */}
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 🔁 Render remaining form fields */}
        {[
          { name: "title", type: "text" },
          { name: "description", type: "textarea" },
          { name: "price", type: "number" },
          { name: "salePrice", type: "number" },
          { name: "discountPercentage", type: "number" },
          { name: "stock", type: "number" },
          { name: "brand", type: "text" },
          { name: "rating", type: "number" },
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name as keyof ProductFormData]}
                onChange={handleChange}
                rows={3}
                required={["title", "price", "rating"].includes(field.name)}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof ProductFormData]}
                onChange={handleChange}
                required={["title", "price", "rating"].includes(field.name)}
              />
            )}
          </div>
        ))}

        {/* Image Upload */}
        <div className="form-group">
          <label>Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

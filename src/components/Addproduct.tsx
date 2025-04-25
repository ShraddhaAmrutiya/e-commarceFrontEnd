// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Product } from "../models/Product";
// import "../AllProduct.css";

// interface ProductFormData {
//   category: string;
//   title: string;
//   description: string;
//   price: string;
//   salePrice: string;
//   discountPercentage: string;
//   stock: string;
//   brand: string;
//   rating: string;
// }

// const AddProduct = () => {
//   const [categories, setCategories] = useState<string[]>([]);
//   const [formData, setFormData] = useState<ProductFormData>({
//     category: "",
//     title: "",
//     description: "",
//     price: "",
//     salePrice: "",
//     discountPercentage: "",
//     stock: "",
//     brand: "",
//     rating: "",
//   });

//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get<{ name: string }[]>("/category/list");
//         const categoryNames = res.data.map((cat) => cat.name);
//         setCategories(categoryNames);
//       } catch (error) {
//         toast.error("Failed to load categories");
//         console.error(error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();

//     Object.entries(formData).forEach(([key, value]) => {
//       if (value !== "") {
//         if (["price", "salePrice", "discountPercentage", "stock", "rating"].includes(key)) {
//           data.append(key, String(parseFloat(value)));
//         } else {
//           data.append(key, value);
//         }
//       }
//     });

//     if (image) {
//       data.append("image", image);
//     }

//     try {
//       const res = await axios.post<{ message: string; product: Product }>("/products/create", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success(res.data.message);
//       setFormData({
//         category: "",
//         title: "",
//         description: "",
//         price: "",
//         salePrice: "",
//         discountPercentage: "",
//         stock: "",
//         brand: "",
//         rating: "",
//       });
//       setImage(null);
//     } catch (error: unknown) {
//       toast.error("Error in adding product");
//       console.error((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-product-container">
//       <form onSubmit={handleSubmit} className="add-product-form" encType="multipart/form-data">
//         <h2>Add Product</h2>

//         <div className="form-group">
//           <label>Category</label>
//           <select name="category" value={formData.category} onChange={handleChange} required>
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 🔁 Render remaining form fields */}
//         {[
//           { name: "title", type: "text" },
//           { name: "description", type: "textarea" },
//           { name: "price", type: "number" },
//           { name: "salePrice", type: "number" },
//           { name: "discountPercentage", type: "number" },
//           { name: "stock", type: "number" },
//           { name: "brand", type: "text" },
//           { name: "rating", type: "number" },
//         ].map((field) => (
//           <div key={field.name} className="form-group">
//             <label>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label>
//             {field.type === "textarea" ? (
//               <textarea
//                 name={field.name}
//                 value={formData[field.name as keyof ProductFormData]}
//                 onChange={handleChange}
//                 rows={3}
//                 required={["title", "price", "rating"].includes(field.name)}
//               />
//             ) : (
//               <input
//                 type={field.type}
//                 name={field.name}
//                 value={formData[field.name as keyof ProductFormData]}
//                 onChange={handleChange}
//                 required={["title", "price", "rating"].includes(field.name)}
//               />
//             )}
//           </div>
//         ))}

//         {/* Image Upload */}
//         <div className="form-group">
//           <label>Image</label>
//           <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
//         </div>

//         {/* Submit Button */}
//         <button type="submit" disabled={loading}>
//           {loading ? "Creating..." : "Create Product"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

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
    discountPercentage: "0",
    stock: "",
    brand: "",
    rating: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    if (name === "discountPercentage") {
      let discount = parseFloat(value);
      const price = parseFloat(formData.price?.toString() || "0");
  
      // Validate and normalize discount
      if (isNaN(discount) || discount < 0) discount = 0;
      if (discount > 100) discount = 100;
  
      // Calculate sale price
      const salePrice = discount === 0
        ? price
        : price - (price * discount) / 100;
  
        setFormData((prev) => ({
          ...prev,
          discountPercentage: String(discount),  // Convert to string
          salePrice: String(salePrice.toFixed(2)),  // Convert to string
        }));
    } else if (name === "price") {
      const price = parseFloat(value);
      const discount = parseFloat(formData.discountPercentage?.toString() || "0");
  
      const salePrice = discount === 0
        ? price
        : price - (price * discount) / 100;
  
        setFormData((prev) => ({
          ...prev,
          price: String(price),  // Convert to string
          salePrice: String(parseFloat(salePrice.toFixed(2))),  // Convert to string
        }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  
  
  
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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

    if (!formData.salePrice && !formData.discountPercentage) {
      errors.salePrice = "Either Sale Price or Discount is required";
      errors.discountPercentage = "Either Discount or Sale Price is required";
    }

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
    if (!validateForm()) return;

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
        salePrice: "",
        discountPercentage: "",
        stock: "",
        brand: "",
        rating: "",
      });
      setImage(null);
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
          <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange}  min="0"
  max="100"/>
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
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

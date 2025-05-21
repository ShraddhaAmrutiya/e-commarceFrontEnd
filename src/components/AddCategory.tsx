import React, { useState, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppDispatch } from "../redux/hooks";
import { addCategories } from "../redux/features/productSlice";
import { Category } from "../models/Category";
import { useTranslation } from "react-i18next";

interface CategoryResponse {
  message: string;
  category?: {
    _id: string;
    name: string;
    description?: string;
  };
}

const AddCategory: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post<CategoryResponse>("/category/add", {
        name,
        description,
      });

      const newCategory: Category = res.data.category!;
      toast.success(res.data.message || t("categorySuccess"), {
        position: "top-center",
        style: {
          backgroundColor: "#2196F3",
          color: "#fff",
          borderRadius: "8px",
          top: "50%",
          transform: "translateY(-50%)",
        },
      });

      dispatch(addCategories([newCategory]));

      setName("");
      setDescription("");
    } catch (error) {
      toast.error(t("categoryExists"));
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">{t("addCategoryTitle")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">
            {t("categoryName")}
          </label>
          <input
            id="name"
            type="text"
            className="w-full border px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-1">
            {t("categoryDescription")}
          </label>
          <textarea
            id="description"
            className="w-full border px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {t("createCategory")}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;

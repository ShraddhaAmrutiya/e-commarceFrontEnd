import React, { useState, FormEvent } from "react";
import axiosInstance from "../utils/axiosInstance";
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
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { t } = useTranslation();

  const categoryNameRegex = /^[a-zA-Z._\s-]{3,20}$/;

  const validateName = (value: string) => {
    if (!categoryNameRegex.test(value)) {
      return t("invalidCategoryName");
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const error = validateName(name);
    setNameError(error);

    if (error) return;

    try {
      const res = await axiosInstance.post<CategoryResponse>("/category/add", {
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
      setSubmitted(false); // Reset submission state after success
    } catch (error) {
     
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">{t("addCategoryTitle")}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">
            {t("categoryName")}
          </label>
          <input
            id="name"
            type="text"
            className={`w-full border px-2 py-1 ${
              submitted && nameError ? "border-red-500" : ""
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {submitted && nameError && (
            <p className="text-red-500 text-sm mt-1">{nameError}</p>
          )}
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {t("createCategory")}
        </button>
      </form>
    </div>
  );
};


export default AddCategory;

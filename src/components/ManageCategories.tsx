import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const ManageCategories = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get<Category[]>("/category/list");
      setCategories(res.data);
    } catch (error) {
      toast.error(t("failedToLoadCategories"));
    }
  };

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setUpdatedName(category.name);
    setUpdatedDescription(category.description || "");
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    try {
      const res = await axiosInstance.put<{
        message: string;
        category: Category;
      }>(`/category/update/${editingCategory._id}`, {
        name: updatedName,
        description: updatedDescription,
      });

      toast.success(res.data.message);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(t("failedToUpdateCategory"));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(t("confirmDeleteCategory"));
    if (!confirmDelete) return;

    try {
      const res = await axiosInstance.delete<{ message: string }>(`/category/delete/${id}`);
      toast.success(res.data.message);
      fetchCategories();
    } catch (error) {
      toast.error(t("failedToDeleteCategory"));
    }
  };

  return (
    <div className="manage-categories-container">
      <h2>{t("manageCategoriesTitle")}</h2>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat._id} className="category-item">
            <div>
              <strong>{cat.name}</strong> — {cat.description || t("noDescription")}
            </div>
            <div className="actions">
              <button onClick={() => handleEditClick(cat)}>{t("edit")}</button>
              <button onClick={() => handleDelete(cat._id)} style={{ color: "red" }}>
                {t("delete")}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingCategory && (
        <div className="modal">
          <div className="modal-content">
            <h3>{t("editCategoryTitle")}</h3>
            <label>
              {t("nameLabel")}:
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </label>
            <label>
              {t("descriptionLabel")}:
              <textarea
                rows={3}
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleUpdate}>{t("update")}</button>
              <button onClick={() => setEditingCategory(null)}>{t("cancel")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;

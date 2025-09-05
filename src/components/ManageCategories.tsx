// import { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import toast from "react-hot-toast";
// import { useTranslation } from "react-i18next";

// interface Category {
//   _id: string;
//   name: string;
//   description?: string;
// }

// const ManageCategories = () => {
//   const { t } = useTranslation();

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [updatedName, setUpdatedName] = useState("");
//   const [updatedDescription, setUpdatedDescription] = useState("");

//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get<Category[]>("/category/list");
//       setCategories(res.data);
//     } catch (error) {
//       toast.error(t("failedToLoadCategories"));
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleEditClick = (category: Category) => {
//     setEditingCategory(category);
//     setUpdatedName(category.name);
//     setUpdatedDescription(category.description || "");
//   };

//   const handleUpdate = async () => {
//     if (!editingCategory) return;

//     try {
//       const res = await axiosInstance.put<{
//         message: string;
//         category: Category;
//       }>(`/category/update/${editingCategory._id}`, {
//         name: updatedName,
//         description: updatedDescription,
//       });

//       toast.success(res.data.message);
//       setEditingCategory(null);
//       fetchCategories();
//     } catch (error) {
//       toast.error(t("failedToUpdateCategory"));
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const confirmDelete = window.confirm(t("confirmDeleteCategory"));
//     if (!confirmDelete) return;

//     try {
//       const res = await axiosInstance.delete<{ message: string }>(`/category/delete/${id}`);
//       toast.success(res.data.message);
//       fetchCategories();
//     } catch (error) {
//       toast.error(t("failedToDeleteCategory"));
//     }
//   };

//   return (
//     <div className="manage-categories-container">
//       <h2>{t("manageCategoriesTitle")}</h2>

//       <ul className="category-list">
//         {categories.map((cat) => (
//           <li key={cat._id} className="category-item">
//             <div>
//               <strong>{cat.name}</strong> — {cat.description || t("noDescription")}
//             </div>
//             <div className="actions">
//               <button onClick={() => handleEditClick(cat)}>{t("edit")}</button>
//               <button onClick={() => handleDelete(cat._id)} style={{ color: "red" }}>
//                 {t("delete")}
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {editingCategory && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>{t("editCategoryTitle")}</h3>
//             <label>
//               {t("nameLabel")}:
//               <input
//                 type="text"
//                 value={updatedName}
//                 onChange={(e) => setUpdatedName(e.target.value)}
//               />
//             </label>
//             <label>
//               {t("descriptionLabel")}:
//               <textarea
//                 rows={3}
//                 value={updatedDescription}
//                 onChange={(e) => setUpdatedDescription(e.target.value)}
//               />
//             </label>
//             <div className="modal-actions">
//               <button onClick={handleUpdate}>{t("update")}</button>
//               <button onClick={() => setEditingCategory(null)}>{t("cancel")}</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageCategories;
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
  }, []);

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setUpdatedName(category.name);
    setUpdatedDescription(category.description || "");
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    try {
      const res = await axiosInstance.put<{ message: string }>(`/category/update/${editingCategory._id}`, {
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">{t("manageCategoriesTitle")}</h2>

      <ul className="space-y-4">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-sm"
          >
            <div>
              <p className="font-semibold text-lg">{cat.name}</p>
              <p className="text-gray-600 text-sm">{cat.description || t("noDescription")}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(cat)}
                className="text-blue-600 hover:underline text-sm"
              >
                {t("edit")}
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-600 hover:underline text-sm"
              >
                {t("delete")}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {t("editCategoryTitle")}
            </h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium">{t("nameLabel")}</span>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">{t("descriptionLabel")}</span>
                <textarea
                  rows={3}
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {t("update")}
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-gray-600 hover:underline"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;

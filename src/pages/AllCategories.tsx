// import { FC, useEffect, useState, useCallback, useRef } from "react";
// import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { addCategories } from "../redux/features/productSlice";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { Category } from "../models/Category";
// import BASE_URL from "../config/apiconfig";
// import { useTranslation } from "react-i18next";

// const AllCategories: FC = () => {
//   const { t } = useTranslation();
//   const dispatch = useAppDispatch();
//   const allCategories = useAppSelector((state) => state.productReducer.categories);
//   const token: string = localStorage.getItem("accessToken") ?? "";
//   const Role: string = localStorage.getItem("Role") ?? "";
//   const descriptionRef = useRef<HTMLInputElement>(null);

//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [deleteId, setDeleteId] = useState<string | null>(null);

//   const language = localStorage.getItem("language") || "en";

//   const fetchCategories = useCallback(async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/category/list`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Accept-Language": language,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to fetch categories");
//       const data = await res.json();
//       dispatch(addCategories(data));
//     } catch {
//       toast.error(t("failedToLoadCategories"));
//     }
//   }, [token, dispatch, language, t]);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   useEffect(() => {
//     if (allCategories.length === 0) fetchCategories();
//   }, [allCategories.length, fetchCategories]);

//   const handleEdit = (category: Category) => {
//     setEditingId(category._id ?? null);
//     setName(category.name);
//     setDescription(category.description ?? "");
//   };

//   const handleUpdate = async () => {
//     if (!editingId) return;
//     try {
//       const res = await fetch(`${BASE_URL}/category/update/${editingId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           "Accept-Language": language,
//         },
//         body: JSON.stringify({ name, description }),
//       });

//       if (!res.ok) throw new Error("Update failed");
//       toast.success(t("categoryUpdated"));
//       setEditingId(null);
//       fetchCategories();
//     } catch {
//       toast.error(t("errorUpdatingCategory"));
//     }
//   };

//   const handleDelete = (id: string) => {
//     setDeleteId(id);
//     setShowModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteId) return;
//     try {
//       const res = await fetch(`${BASE_URL}/category/delete/${deleteId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Accept-Language": language,
//         },
//       });
//       if (!res.ok) throw new Error("Delete failed");
//       toast.success(t("categoryDeleted"));
//       setShowModal(false);
//       fetchCategories();
//     } catch {
//       toast.error(t("errorDeletingCategory"));
//       setShowModal(false);
//     }
//   };

//   return (
//     <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-yellow-50 via-rose-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
//       <div className="max-w-screen-xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">📂 {t("categories")}</h1>

//         <div className="space-y-4">
//           {allCategories?.map((category) => (
//             <div
//               key={category._id}
//               className="flex justify-between items-start bg-white dark:bg-slate-700 shadow-sm hover:shadow-md transition rounded-lg p-4"
//             >
//               {editingId === category._id ? (
//                 <div className="w-full">
//                   <input
//                     className="w-full p-2 mb-2 text-black rounded border border-gray-300"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && descriptionRef.current?.focus()}
//                   />
//                   <input
//                     ref={descriptionRef}
//                     className="w-full p-2 mb-3 text-black rounded border border-gray-300"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
//                   />
//                   <div className="flex gap-2">
//                     <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleUpdate}>
//                       {t("save")}
//                     </button>
//                     <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditingId(null)}>
//                       {t("cancel")}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex-1 pr-4">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{category.name}</h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
//                     <Link to={`/category/${category._id}`} className="text-sm text-blue-500 hover:underline">
//                       {t("viewProducts")}
//                     </Link>
//                   </div>

//                   {Role === "admin" && (
//                     <div className="flex gap-2 items-center">
//                       <button
//                         className="text-sm bg-yellow-400 text-black px-2 py-1 rounded"
//                         onClick={() => handleEdit(category)}
//                       >
//                         {t("edit")}
//                       </button>
//                       <button
//                         className="text-sm bg-red-500 text-white px-2 py-1 rounded"
//                         onClick={() => handleDelete(category._id!)}
//                       >
//                         {t("delete")}
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}
//         </div>

//         {showModal && <DeleteConfirmModal onConfirm={confirmDelete} onCancel={() => setShowModal(false)} />}
//       </div>
//     </div>
//   );
// };

// const DeleteConfirmModal: FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
//   const { t } = useTranslation();
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg text-center w-80">
//         <h2 className="text-lg font-semibold mb-4 dark:text-white">{t("confirmDeletion")}</h2>
//         <p className="text-gray-800 dark:text-gray-300 mb-4">{t("confirmDeleteCategory")}</p>
//         <div className="flex justify-center gap-4">
//           <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirm}>
//             {t("yesDelete")}
//           </button>
//           <button
//             className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded"
//             onClick={onCancel}
//           >
//             {t("cancel")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllCategories;

import { FC, useEffect, useState, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCategories } from "../redux/features/productSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Category } from "../models/Category";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

const AllCategories: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allCategories = useAppSelector((state) => state.productReducer.categories);
  const token = localStorage.getItem("accessToken") ?? "";
  const Role = localStorage.getItem("Role") ?? "";
  const language = localStorage.getItem("language") || "en";

  const descriptionRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/category/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      dispatch(addCategories(data));
    } catch {
      toast.error(t("failedToLoadCategories"));
    }
  }, [token, language, dispatch, t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (allCategories.length === 0) fetchCategories();
  }, [allCategories.length, fetchCategories]);

  const handleEdit = (category: Category) => {
    setEditingId(category._id ?? null);
    setName(category.name);
    setDescription(category.description ?? "");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`${BASE_URL}/category/update/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success(t("categoryUpdated"));
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error(t("errorUpdatingCategory"));
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${BASE_URL}/category/delete/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(t("categoryDeleted"));
      setShowModal(false);
      fetchCategories();
    } catch {
      toast.error(t("errorDeletingCategory"));
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-gradient-to-br from-yellow-50 via-rose-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          📂 {t("categories")}
        </h1>

        <div className="space-y-6">
          {allCategories?.map((category) => (
            <div
              key={category._id}
              className="bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:shadow-lg transition p-4 md:p-6 flex flex-col md:flex-row justify-between gap-4"
            >
              {editingId === category._id ? (
                <div className="w-full">
                  <input
                    className="w-full mb-2 p-2 text-black rounded border border-gray-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && descriptionRef.current?.focus()}
                  />
                  <input
                    ref={descriptionRef}
                    className="w-full mb-4 p-2 text-black rounded border border-gray-300"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                  />
                  <div className="flex gap-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      onClick={handleUpdate}
                    >
                      {t("save")}
                    </button>
                    <button
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                    <Link
                      to={`/category/${category._id}`}
                      className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                    >
                      {t("viewProducts")}
                    </Link>
                  </div>

                  {Role === "admin" && (
                    <div className="flex gap-2 self-start md:self-center">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm"
                        onClick={() => handleEdit(category)}
                      >
                        {t("edit")}
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleDelete(category._id!)}
                      >
                        {t("delete")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {showModal && (
          <DeleteConfirmModal onConfirm={confirmDelete} onCancel={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

const DeleteConfirmModal: FC<{ onConfirm: () => void; onCancel: () => void }> = ({
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg text-center w-[90%] sm:w-96">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          {t("confirmDeletion")}
        </h2>
        <p className="text-gray-800 dark:text-gray-300 mb-4">
          {t("confirmDeleteCategory")}
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirm}>
            {t("yesDelete")}
          </button>
          <button
            className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCategories;

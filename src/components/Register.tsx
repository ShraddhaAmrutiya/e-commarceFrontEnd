// import { useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BASE_URL from "../config/apiconfig";
// import { useTranslation } from "react-i18next";

// type AxiosErrorLike = {
//   response: {
//     data: {
//       message?: string;
//       errors?: Record<string, string>;
//     };
//   };
// };

// const InputField = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   description,
//   error,
//   required = true,
// }: {
//   label: string;
//   name: string;
//   type?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   description?: string;
//   error?: string;
//   required?: boolean;
// }) => {
//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 dark:text-white">
//         {label}
//         {required && <span className="text-red-500"> *</span>}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className={`w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white ${
//           error ? "border-red-500" : ""
//         }`}
//       />
//       {description && (
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
//       )}
//       {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// };

// const Register = () => {
//   const { t, i18n } = useTranslation();

//   const [formData, setFormData] = useState({
//     userName: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     age: "",
//     gender: "",
//     password: "",
//     Role: "customer",
//   });

//   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
//       toast.error(t("invalidAge"));
//       return;
//     }

//     try {
//       const payload = {
//         ...formData,
//         age: Number(formData.age),
//       };

//       const res = await axiosInstance.post(`${BASE_URL}/users/register`, payload, {
//         headers: {
//           "Accept-Language": i18n.language,
//         },
//       });

//       const data = res.data as {
//         success: boolean;
//         message?: string;
//         token?: string;
//         userId?: string;
//         Role?: string;
//         userName?: string;
//       };

//       if (data.success && data.token && data.userId && data.Role && data.userName) {
//         localStorage.setItem("authToken", data.token);
//         localStorage.setItem("accessToken", data.token);
//         localStorage.setItem("userId", data.userId);
//         localStorage.setItem("Role", data.Role);
//         localStorage.setItem("userName", data.userName);

//         axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//         axiosInstance.defaults.headers.common["userId"] = data.userId;
//         axiosInstance.defaults.headers.common["Role"] = data.Role;
//         axiosInstance.defaults.headers.common["userName"] = data.userName;

//         toast.success(t("regSuccess"));

//         setTimeout(() => {
//           window.location.href = "/";
//         }, 1500);
//       } else {
//         toast.error(data.message || t("regFailed"));
//       }
//     } catch (err: unknown) {
//       if (typeof err === "object" && err !== null && "response" in err) {
//         const errorObj = err as AxiosErrorLike;

//         if (errorObj.response.data.errors) {
//           setFieldErrors(errorObj.response.data.errors);
//         }

//         if (
//           errorObj.response.data.message &&
//           errorObj.response.data.message.includes(
//             "E11000 duplicate key error collection"
//           )
//         ) {
//           toast.error(t("usernameDuplicate"));
//         } else {
//           toast.error(t("usernameTaken"));
//         }
//       } else {
//         toast.error(t("regFailed"));
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
//           {t("createAccount")}
//         </h2>

//         <InputField
//           label={t("username")}
//           name="userName"
//           value={formData.userName}
//           onChange={handleChange}
//           error={fieldErrors.userName}
//         />
//         <InputField
//           label={t("firstName")}
//           name="firstName"
//           value={formData.firstName}
//           onChange={handleChange}
//           error={fieldErrors.firstName}
//         />
//         <InputField
//           label={t("lastName")}
//           name="lastName"
//           value={formData.lastName}
//           onChange={handleChange}
//           error={fieldErrors.lastName}
//         />
//         <InputField
//           type="email"
//           label={t("email")}
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           error={fieldErrors.email}
//         />
//         <InputField
//           type="tel"
//           label={t("phone")}
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           error={fieldErrors.phone}
//           required={false}
//         />
//         <InputField
//           type="number"
//           label={t("age")}
//           name="age"
//           value={formData.age}
//           onChange={handleChange}
//           error={fieldErrors.age}
//         />

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 dark:text-white">
//             {t("gender")}
//           </label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
//           >
//             <option value="">{t("selectGender")}</option>
//             <option value="Female">{t("female")}</option>
//             <option value="Male">{t("male")}</option>
//             <option value="Other">{t("other")}</option>
//           </select>
//           {fieldErrors.gender && (
//             <p className="text-sm text-red-500 mt-1">{fieldErrors.gender}</p>
//           )}
//         </div>

//         <InputField
//           type="password"
//           label={t("password")}
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           error={fieldErrors.password}
//         />

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 dark:text-white">
//             {t("role")} <span className="text-red-500">*</span>
//           </label>
//           <select
//             name="Role"
//             value={formData.Role}
//             onChange={handleChange}
//             className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
//           >
//             <option value="customer">{t("customer")}</option>
//             <option value="seller">{t("seller")}</option>
//             <option value="admin">{t("admin")}</option>
//           </select>
//           {fieldErrors.Role && (
//             <p className="text-sm text-red-500 mt-1">{fieldErrors.Role}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
//         >
//           {t("register")}
//         </button>

//         <ToastContainer />
//       </form>
//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

type AxiosErrorLike = {
  response: {
    data: {
      message?: string;
      errors?: Record<string, string>;
    };
  };
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  description,
  error,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  error?: string;
  required?: boolean;
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const Register = () => {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    password: "",
    Role: "customer",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      toast.error(t("invalidAge"));
      return;
    }

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
      };

      const res = await axiosInstance.post<{
        success: boolean;
        message?: string;
        token?: string;
        userId?: string;
        Role?: string;
        userName?: string;
      }>(`${BASE_URL}/users/register`, payload, {
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      const data = res.data;

      if (data.success && data.token && data.userId && data.Role && data.userName) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("Role", data.Role);
        localStorage.setItem("userName", data.userName);

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        axiosInstance.defaults.headers.common["userId"] = data.userId;
        axiosInstance.defaults.headers.common["Role"] = data.Role;
        axiosInstance.defaults.headers.common["userName"] = data.userName;

        toast.success(t("regSuccess"));

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(data.message || t("regFailed"));
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as AxiosErrorLike;

        if (errorObj.response.data.errors) {
          setFieldErrors(errorObj.response.data.errors);
        }

        if (
          errorObj.response.data.message &&
          errorObj.response.data.message.includes("E11000 duplicate key")
        ) {
          toast.error(t("usernameDuplicate"));
        } else {
          toast.error(t("usernameTaken"));
        }
      } else {
        toast.error(t("regFailed"));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 pt-24 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          {t("createAccount")}
        </h2>

        <InputField
          label={t("username")}
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          error={fieldErrors.userName}
        />
        <InputField
          label={t("firstName")}
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={fieldErrors.firstName}
        />
        <InputField
          label={t("lastName")}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={fieldErrors.lastName}
        />
        <InputField
          type="email"
          label={t("email")}
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <InputField
          type="tel"
          label={t("phone")}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={fieldErrors.phone}
          required={true}
        />
        <InputField
          type="number"
          label={t("age")}
          name="age"
          value={formData.age}
          onChange={handleChange}
          error={fieldErrors.age}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            {t("gender")}
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t("selectGender")}</option>
            <option value="Female">{t("female")}</option>
            <option value="Male">{t("male")}</option>
            <option value="Other">{t("other")}</option>
          </select>
          {fieldErrors.gender && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.gender}</p>
          )}
        </div>

        <InputField
          type="password"
          label={t("password")}
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        {/* <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            {t("role")} <span className="text-red-500">*</span>
          </label>
          <select
            name="Role"
            value={formData.Role}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="customer">{t("customer")}</option>
            <option value="seller">{t("seller")}</option>
            <option value="admin">{t("admin")}</option>
          </select>
          {fieldErrors.Role && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.Role}</p>
          )}
        </div> */}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-300 ease-in-out"
        >
          {t("register")}
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default Register;

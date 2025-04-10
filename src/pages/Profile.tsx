import { FC, useEffect, useState } from "react";

interface Address {
  address: string;
  city: string;
  postalCode: string;
  state: string;
}

interface UserInfo {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: Address;
}

const Profile: FC = () => {
  const [info, setInfo] = useState<UserInfo>();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken"); // Retrieve token
  
    if (!userId) {
      console.error("User ID not found!");
      return;
    }

    if (!token) {
      console.error("Token not found!");
      return;
    }

    fetch(`http://localhost:5000/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized: Invalid or missing token");
        }
        return res.json();
      })
      .then((data) => setInfo(data))
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <div className="container mx-auto w-full max-w-5xl dark:text-white bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-lg">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">Your Account</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Info Table */}
          <div className="bg-gradient-to-r from-purple-200 to-blue-300 rounded-lg p-6 shadow-lg">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="font-semibold py-3 text-lg">UserName</td>
                  <td className="py-3 text-lg">{info?.userName}</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-300">
                  <td className="font-semibold py-3 text-lg">First Name</td>
                  <td className="py-3 text-lg">{info?.firstName}</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-300">
                  <td className="font-semibold py-3 text-lg">Last Name</td>
                  <td className="py-3 text-lg">{info?.lastName}</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-300">
                  <td className="font-semibold py-3 text-lg">Email</td>
                  <td className="py-3 text-lg">{info?.email}</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-300">
                  <td className="font-semibold py-3 text-lg">Phone</td>
                  <td className="py-3 text-lg">{info?.phone}</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-300">
                  <td className="font-semibold py-3 text-lg">Age</td>
                  <td className="py-3 text-lg">{info?.age}</td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-100 transition duration-300">
                  <td className="font-semibold py-3 text-lg">Gender</td>
                  <td className="py-3 text-lg">{info?.gender}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

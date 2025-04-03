import { FC, useEffect, useState } from "react";

interface Address {
  address: string;
  city: string;
  postalCode: string;
  state: string;
}



interface UserInfo {
  id: number;
  username: string;
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
        "Authorization": `Bearer ${token}`,      },
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
    <div className="container mx-auto min-h-[83vh] w-full max-w-5xl dark:text-white">
      <h1 className="text-4xl p-4 font-bold font-lora">Your Account</h1>
      <div className="font-karla grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-1 p-4">
        <table>
          <tbody>
            <tr>
              <td className="font-bold">Username</td>
              <td>{info?.username}</td>
            </tr>
            <tr>
              <td className="font-bold">First Name</td>
              <td>{info?.firstName}</td>
            </tr>
            <tr>
              <td className="font-bold">Last Name</td>
              <td>{info?.lastName}</td>
            </tr>
         
            <tr>
              <td className="font-bold">Email</td>
              <td>{info?.email}</td>
            </tr>
            <tr>
              <td className="font-bold">Phone</td>
              <td>{info?.phone}</td>
            </tr>
            
            <tr>
              <td className="font-bold">Age</td>
              <td>{info?.age}</td>
            </tr>
            <tr>
              <td className="font-bold">Gender</td>
              <td>{info?.gender}</td>
            </tr>
            
          </tbody>
        </table>
        <div className="space-y-2">
          {/* <div>
            <h1 className="font-bold">Address</h1>
            <p>{info?.address.address}</p>
            <p>
              {info?.address.city}, {info?.address.postalCode},{" "}
              {info?.address.state}
            </p>
          </div> */}
          <div>            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

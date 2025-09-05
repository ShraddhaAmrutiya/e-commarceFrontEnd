import { FC } from "react";
import { Link } from "react-router-dom";

const HeroSection: FC = () => {
  return (
    <div className="bg-[#e3edf6] dark:bg-slate-600 font-lora">
      <div className="container px-4 grid md:grid-cols-2 py-8 mx-auto">
        <div className="flex items-center">
          <div className="max-w-[450px] space-y-4">
            <p className="text-black dark:text-white">
              Starting At <span className="font-bold">rupees 66000</span>
            </p>
            <h2 className="text-black font-bold text-4xl md:text-5xl dark:text-white">
              Laptop
            </h2>
            <h3 className="text-2xl dark:text-white">
              Exclusive offer <span className="text-red-600">-12%</span> off
              this week
            </h3>
            <Link
              to="/products/6821c2f2d05f336429b1538d"
              data-test="hero-btn"
              className="inline-block bg-white rounded-md px-6 py-3 hover:bg-blue-500 hover:text-white"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div>
          <img src="http://localhost:3000/uploads/1747043058586-download.jpg" alt="Shoes" className="ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;


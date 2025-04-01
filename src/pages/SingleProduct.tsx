

 import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { addToCart } from "../redux/features/cartSlice";
import { Product } from "../models/Product";
import RatingStar from "../components/RatingStar";
import PriceSection from "../components/PriceSection";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";
import ProductList from "../components/ProductList";
import useAuth from "../hooks/useAuth";
import { MdFavoriteBorder } from "react-icons/md";
import { addToWishlist } from "../redux/features/productSlice";

const SingleProduct: FC = () => {
  const dispatch = useAppDispatch();
  const { _id } = useParams<{ _id?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [imgs, setImgs] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [Category, setScategory] = useState<string>("");
  const [similar, setSimilar] = useState<Product[]>([]);
  const { requireAuth } = useAuth();

  useEffect(() => {
    // console.log("Fetching Product with ID:", _id);

    if (!_id) {
      toast.error("Invalid product ID!");
      console.error("Error: _id is undefined or empty in useParams().");
      return;
    }

    fetch(`http://localhost:5000/products/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Full API Response:", data);

        if (!data || !data.product || !data.product._id) {
          toast.error("Product not found!");
          return;
        }

        const { image, category } = data.product;
        const categoryName = typeof category === "object" && category?.name ? category.name : "Unknown";
        // console.log("Extracted Category Name:", categoryName);

        const fullImageUrls = Array.isArray(image)
          ? image.map((img) => (img.startsWith("/") ? `http://localhost:5000${img}` : img))
          : image
          ? [image.startsWith("/") ? `http://localhost:5000${image}` : image]
          : [];

        setProduct(data.product);
        setImgs(fullImageUrls);
        setScategory(categoryName);
        setSelectedImg(fullImageUrls.length > 0 ? fullImageUrls[0] : "");
      })
      .catch((error) => {
        toast.error("Error fetching product details!");
        console.error(error);
      });
  }, [_id]);

  useEffect(() => {
    if (!Category) return;

    fetch(`http://localhost:5000/products/category/${Category}`)
      .then((res) => res.json())
      .then((data) => { 
        if (!Array.isArray(data.products)) return;
        setSimilar(data.products.filter((p: Product) => p._id !== _id));
      })
      .catch(console.error);
  }, [_id,Category]);

  const addCart = () => {
    requireAuth(() => {
      if (!product) {
        console.error("❌ Error: No product found to add to cart.");
        return;
      }

      // console.log("🛒 Adding to Cart:", product);
      dispatch(addToCart({ ...product, _id: product._id ?? "" }));
      toast.success("Added to cart!");
    });
  };

  const buyNow = () => {
    requireAuth(() => {
      if (!product) return;
      dispatch(addToCart({ ...product, _id: product._id ?? "" }));
      toast.success("Proceeding to checkout!");
    });
  };

  const addWishlist = () => {
    requireAuth(() => {
      if (!product) return;
      dispatch(addToWishlist(product));
      toast.success("Item added to your wishlist");
    });
  };

  return (
    <div className="container mx-auto pt-8 dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 font-karla">
        <div className="space-y-2">
          {selectedImg && <img src={selectedImg} alt="Product" className="h-80 object-cover" />}
          <div className="flex space-x-1 items-center">
            {imgs.map((_img) => (
              <img
                src={_img}
                key={_img}
                className={`w-12 cursor-pointer hover:border-2 hover:border-black ${_img === selectedImg ? "border-2 border-black" : ""}`}
                onClick={() => setSelectedImg(_img)}
              />
            ))}
          </div>
        </div>
        <div className="px-2">
          <h2 className="text-2xl">{product?.title}</h2>
          {product?.rating && <RatingStar rating={product.rating} />}
          {product?.discountPercentage && <PriceSection discountPercentage={product.discountPercentage} price={product.price} />}
          {product && (
            <table className="mt-2">
              <tbody>
                {product.brand && <tr><td className="pr-2 font-bold">Brand</td><td>{product.brand}</td></tr>}
                {typeof product.category === "object" && product.category?.name && <tr><td className="pr-2 font-bold">Category</td><td>{product.category.name}</td></tr>}
                {product.description && <tr><td className="pr-2 font-bold">Description</td><td>{product.description}</td></tr>}
              </tbody>
            </table>
          )}
          <div className="flex justify-between mt-4">
            <button className="flex items-center bg-black text-white p-2 rounded w-24" onClick={addCart}><AiOutlineShoppingCart /> Add to Cart</button>
            <button className="flex items-center bg-black text-white p-2 rounded w-24" onClick={buyNow}><FaHandHoldingDollar /> Buy Now</button>
          </div>
          <div className="flex mt-4 items-center space-x-2">
            <button className="text-xl dark:text-white" onClick={addWishlist}><MdFavoriteBorder /></button>
            <span>Add to Wishlist</span>
          </div>
        </div>
      </div>
      {similar.length > 0 && <ProductList title="Similar Products" products={similar} />}
    </div>
  );
};

export default SingleProduct;

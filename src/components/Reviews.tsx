import { FC, useEffect, useState } from "react";
import RatingStar from "./RatingStar";
import { ReviewItem } from "../models/ReviewItem";

const reviews: ReviewItem[] = [
  {
    userName: "atuny0",
    rating: 5,
    review:
      "The product is nice. I got the delivery on time. I am using it for the last four months. My exprience with this product is very good.",
  },
  {
    userName: "hbingley1",
    rating: 4,
    review:
      "I am satisfied with the value for money of the product. Everything seems nice but the delivery time seems a bit delayed",
  },
  {
    userName: "rshawe2",
    rating: 3,
    review:
      "I found the product not long lasting. The quality also seemed a bit downgraded. I don't think its value for money.",
  },
  {
    userName: "yraigatt3",
    rating: 4,
    review:
      "The product is nice. I got the delivery on time. I am using it for the last four months. My exprience with this product is very good.",
  },
  {
    userName: "kmeus4",
    rating: 3,
    review:
      "The quality could have been better. I feel like wasting my money. I should have been more careful while buying it.",
  },
  {
    userName: "dpettegre6",
    rating: 5,
    review:
      "The product is nice. I got the delivery on time. I am using it for the last four months. My exprience with this product is very good.",
  },
  {
    userName: "ggude7",
    rating: 4,
    review:
      "I am satisfied with the value for money of the product. Everything seems nice but the delivery time seems a bit delayed",
  },
  {
    userName: "nloiterton8",
    rating: 3,
    review:
      "I found the product not long lasting. The quality also seemed a bit downgraded. I don't think its value for money.",
  },
  {
    userName: "umcgourty9",
    rating: 4,
    review:
      "The product is nice. I got the delivery on time. I am using it for the last four months. My exprience with this product is very good.",
  },
  {
    userName: "rhallawellb",
    rating: 3,
    review:
      "The quality could have been better. I feel like wasting my money. I should have been more careful while buying it.",
  },
];

const getShuffledArr = () => {
  const arr: ReviewItem[] = [];
  const start = Math.floor(Math.random() * 4);
  for (let index = start; index < start + 5; index++) {
    arr.push(reviews[index]);
  }
  return arr;
};

const Reviews: FC<{ _id: number }> = ({ _id }) => {
  const [items, setItems] = useState<ReviewItem[]>([]);

  useEffect(() => {
    const _arr = getShuffledArr();
    setItems(_arr);
  }, [_id]);

  return (
    <div className="px-2">
      <h1 className="text-2xl font-semibold mb-2">Reviews</h1>
      <div className="space-y-2">
        {items?.map(({ userName, rating, review }) => (
          <div key={userName} className="leading-4" data-test="review-item">
            <h3 className="font-semibold text-md">{userName}</h3>
            <RatingStar rating={rating} />
            <p className="text-sm leading-4">{review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Reviews;

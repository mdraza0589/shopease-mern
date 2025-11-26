import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ totalStars = 5, onRatingChange }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);

    const handleClick = (starValue) => {
        setRating(starValue);
        if (onRatingChange) onRatingChange(starValue);
    };

    return (
        <div className="flex space-x-1">
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <FaStar
                        key={starValue}
                        size={28}
                        className={`cursor-pointer transition-colors duration-200 ${starValue <= (hover || rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(null)}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;

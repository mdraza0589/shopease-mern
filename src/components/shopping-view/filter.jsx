import React from 'react';
import { filterOptions } from '../../config';

const ProductFilter = ({ handleFilter, filters }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-6 border border-gray-100">
            {Object.keys(filterOptions).map((keyItem) => (
                <div
                    key={keyItem}
                    className="border-b border-gray-200 pb-4 last:border-none last:pb-0"
                >
                    {/* Section Header */}
                    <h3 className="font-bold text-lg text-gray-800 mb-3 capitalize">
                        {keyItem}
                    </h3>

                    {/* Filter Options */}
                    <div className="flex flex-col gap-2 pl-1">
                        {filterOptions[keyItem].map((option) => {
                            const isChecked =
                                filters[keyItem]?.includes(option.label) || false;
                            return (
                                <label
                                    key={option.label}
                                    className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleFilter(keyItem, option.label)}
                                        className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600"
                                    />
                                    <span className="text-sm">{option.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductFilter;

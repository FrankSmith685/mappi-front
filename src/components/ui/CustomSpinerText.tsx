import React from "react";

const CustomSpinnerText: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default CustomSpinnerText;

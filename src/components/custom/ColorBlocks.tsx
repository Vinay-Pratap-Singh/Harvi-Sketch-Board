import React from "react";
type IColorCode = {
  colorCode: string;
  type: string;
};
const ColorBlocks = ({ colorCode, type }: IColorCode) => {
  const currentStrokeColorCode = "#000000";
  const currentCanvasColorCode = "#FFFFFF";
  return (
    <div
      tabIndex={0}
      className={`rounded-[8px] w-fit cursor-pointer transition-all ease-in-out duration-300 ${
        type === "stroke" && currentStrokeColorCode === colorCode
          ? "border-[1px] border-mainPrimary"
          : "hover:border-[1px] hover:border-gray-300"
      } ${
        type === "canvas" && currentCanvasColorCode === colorCode
          ? "border-[1px] border-mainPrimary"
          : "hover:border-[1px] hover:border-gray-300"
      }`}
    >
      <div
        style={{ backgroundColor: colorCode }}
        className={`w-6 h-6 rounded-[6px] m-[2px] ${
          type === "canvas" && "border-[1px] border-gray-200"
        }`}
      />
    </div>
  );
};

export default ColorBlocks;
"use client";

import cn from "@/utils/cn";
import React, { useCallback } from "react";
import Check from "./icons/check";
import X from "./icons/x";

export default function Toggle({
  toggled = false,
  disabled = false,
  setToggled,
  tabIndex,
}: {
  toggled?: boolean;
  disabled?: boolean;
  setToggled?: (toggled: boolean) => void;
  tabIndex?: number;
}) {
  const handleToggle = useCallback(() => {
    if (disabled) {
      console.log("disabled");
      return;
    }
    setToggled?.(!toggled);
  }, [toggled, setToggled]);

  return (
    <button
      className={cn(
        `relative h-7 w-12 cursor-pointer rounded-full duration-200`,
        toggled ? "bg-blue-500" : "bg-[#24252d50]",
        disabled ? "cursor-not-allowed bg-gray-200" : "cursor-pointer"
      )}
      onClick={handleToggle}
      disabled={disabled}
      tabIndex={tabIndex}
    >
      <span
        className={cn(
          `absolute left-0 top-0 flex items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200`,
          toggled ? "translate-x-full transform" : "translate-x-0 transform",
          toggled ? "h-5 w-5" : "h-4 w-4",
          toggled ? "m-1" : "m-1.5"
        )}
      >
        <span className="relative flex h-full w-full">
          <Check
            className={cn(
              "absolute left-0 top-0 h-full w-full p-0.5 text-blue-500 transition-opacity duration-200",
              toggled ? "opacity-100" : "opacity-0"
            )}
          />
          <X
            className={cn(
              "absolute left-0 top-0 h-full w-full p-0.5 text-[#24252d50] transition-opacity duration-200",
              toggled ? "opacity-0" : "opacity-100"
            )}
          />
        </span>
      </span>
    </button>
  );
}

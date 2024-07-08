"use client";

import cn from "@/utils/cn";
import React, { useCallback } from "react";
import Person from "./icons/person";
import PersonFilled from "./icons/personFilled";

export default function RemoveBGToggle({
  toggled = false,
  disabled = false,
  setToggled,
}: {
  toggled?: boolean;
  disabled?: boolean;
  setToggled?: (toggled: boolean) => void;
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
        `flex items-center justify-center gap-1 px-1.5 cursor-pointer rounded-full duration-200 text-white `,
        toggled ? "bg-blue-500" : "bg-[#24252d50]",
        disabled ? "cursor-not-allowed bg-gray-200" : "cursor-pointer"
      )}
      onClick={handleToggle}
      disabled={disabled}
      data-tooltip-content={"Remove Background"}
      data-tooltip-delay-hide={100}
      data-tooltip-delay-show={100}
      data-tooltip-id={!disabled ? "tooltip" : undefined}
    >
      <PersonFilled className="w-4 h-4" />
      <p className="font-thin">{"->"}</p>
      <Person className="w-4 h-4" />
    </button>
  );
}

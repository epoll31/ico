import * as React from "react";
import type { SVGProps } from "react";
export default function Pmndrs(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 50 50"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.5 35H32.5V50H17.5V35ZM17.5 17.5H32.5V32.5H17.5V17.5ZM0 17.5H15V32.5H0V17.5Z"
        fill="inherit"
      />
      <path d="M35 0H17.5V15H35V32.5H50V0H35Z" fill="inherit" />
    </svg>
  );
}

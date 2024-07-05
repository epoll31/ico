import Link from "next/link";
import Github from "./icons/github";

export default function Footer() {
  return (
    <footer className="flex  items-center justify-center gap-4 p-10">
      <p className="text-center text-sm">
        Made by{" "}
        <Link
          href="https://epoll31.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          Ethan Pollack
        </Link>
      </p>
      <span className="w-px h-3/4 bg-black" />
      <Link
        href="https://github.com/epoll31/ico"
        target="_blank"
        rel="noreferrer"
      >
        <Github className="w-6 h-6 m-0.5 hover:text-blue-500 transition-colors" />
      </Link>
    </footer>
  );
}

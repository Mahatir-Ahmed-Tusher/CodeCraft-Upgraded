import Image from "next/image";
import Link from "next/link";
import code from "../public/code.png";
import GithubIcon from "./github-icon";

export default function Header() {
  return (
    <header className="relative mx-auto mt-4 flex w-full items-center justify-center px-2 pb-7 sm:px-4">
      <Link href="/" className="absolute flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 pt-16">
          <Image alt="header text" src={code} className="h-6 w-6" />
          <h1 className="text-3xl tracking-tight">
            <span className="text-blue-600">Code</span>Craft
          </h1>
        </div>
        <p className="text-sm pt-2">
          <span className="text-blue-600">Build Apps</span>
          <span className="text-gray-900 dark:text-white"> with AI Magic</span>
        </p>
      </Link>
      <a
        href="https://github.com/Mahatir-Ahmed-Tusher/CodeCraft-Upgraded.git"
        target="_blank"
        className="ml-auto hidden items-center gap-3 rounded-2xl bg-white dark:bg-[#1E293B] dark:text-gray-100 px-6 py-2 sm:flex border border-gray-200 dark:border-gray-700"
      >
        <GithubIcon className="h-4 w-4 dark:text-gray-100" />
        <span>GitHub</span>
      </a>
    </header>
  );
}

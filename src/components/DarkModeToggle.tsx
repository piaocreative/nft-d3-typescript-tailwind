import React, { memo, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";

type Props = {
  className?: string;
};

export const DarkModeToggle: React.VFC<Props> = memo(({ className }) => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={className}>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex justify-center p-2 text-gray-500 transition duration-150 ease-in-out bg-gray-50 border border-transparent rounded-md dark:text-gray-200 dark:bg-gray-800 hover:text-gray-700 focus:outline-none"
      >
        {theme === "dark" ? (
          <MoonIcon className="w-4 h-4 transform -rotate-90" />
        ) : (
          <SunIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
});

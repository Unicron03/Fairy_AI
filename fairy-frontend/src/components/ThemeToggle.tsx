import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded bg-gray-100 dark:bg-[#27272a] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
      title="Changer la couleur du thème"
    >
      {dark ? (
        <>
          <SunIcon className="h-5 w-5 text-yellow-400" />
          <span className="text-sm">Clair</span>
        </>
      ) : (
        <>
          <MoonIcon className="h-5 w-5 text-gray-800" />
          <span className="text-sm">Sombre</span>
        </>
      )}
    </button>
  );
}

export default ThemeToggle;

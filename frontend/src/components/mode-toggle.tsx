import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <>
      {theme === "dark" ? (
        <>
          <Moon
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all"
            onClick={toggleTheme}
          />
        </>
      ) : (
        <>
          <Sun
            onClick={toggleTheme}
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all"
          />
        </>
      )}

      <span onClick={toggleTheme} className="w-full ">
        {theme === "dark" ? "Dark Mode" : "Light Mode"}
      </span>
    </>
  );
}

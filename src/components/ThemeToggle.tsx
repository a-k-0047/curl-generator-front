import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // ページ読み込み時にlocalStorageからテーマ状態を復元
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const dark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  // ダークモード切り替え関数
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <Button onClick={toggleTheme} variant="outline">
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
};

export default ThemeToggle;

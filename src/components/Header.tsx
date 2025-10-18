import React from 'react';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="shadow shadow-input">
      <div className="flex items-center justify-between max-w-2xl px-4 py-4 mx-auto">
        <h1 className="flex items-center space-x-2 text-2xl font-bold text-primary">
          <span>Curl Generator</span>
        </h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href="https://github.com/a-k-0047/curl-generator-front"
            target="_blank"
          >
            {/* 通常モード */}
            <img
              src="/GitHub_Logo.png"
              alt="Light mode"
              className="block w-16 dark:hidden"
            />
            {/* ダークモード */}
            <img
              src="/GitHub_Logo_White.png"
              alt="Dark mode"
              className="hidden w-16 dark:block"
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;

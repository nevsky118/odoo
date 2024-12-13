import React from "react";
import "../styles.css";

const Header: React.FC = () => (
  <header className="bg-white dark:bg-gray-800 shadow">
    <div className="max-w-7xl mx-left px-2 sm:px-4 lg:px-6">
      <div className="flex justify-between h-16 items-center">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Обучающая Платформа
        </h1>
      </div>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-gray-800 shadow">
    <div className="max-w-7xl  py-4 px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          &copy; 2024 Your Company Name. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow p-6">{children}</main>
    <Footer />
  </div>
);

export default Layout;

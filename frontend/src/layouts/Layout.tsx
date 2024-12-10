import React from 'react';
import '../styles.css';

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-left px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16">
            {/* Название */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Обучающая Платформа</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-left py-4 px-2 sm:px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Копирайт */}
            <p className="text-gray-600 dark:text-gray-300 text-sm">&copy; 2024 Обучающая Платформа. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
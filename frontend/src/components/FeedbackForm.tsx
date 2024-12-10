import React, { useState } from 'react';

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState({
    category: '',
    message: '',
    file: null as File | null,
  });

  const [errors, setErrors] = useState({
    category: '',
    message: '',
    file: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      file,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append('category', formData.category);
    data.append('message', formData.message);
    if (formData.file) {
      data.append('file', formData.file);
    }

    try {
      const response = await fetch('http://localhost:8000/submit-form', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setFormData({ category: '', message: '', file: null });
      } else {
        alert(result.detail || 'Произошла ошибка при отправке формы.');
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert('Произошла ошибка при отправке формы.');
    }
  };

  return (
    <form id="feedback-form" onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded">
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Тема сообщения</label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">-- Выберите тему --</option>
          <option value="general">Общий вопрос</option>
          <option value="technical">Техническая поддержка</option>
          <option value="billing">Биллинг и оплата</option>
          <option value="course">Курс и обучение</option>
          <option value="other">Другое</option>
        </select>
        <span className="error text-red-500 text-sm" id="category-error">{errors.category}</span>
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Сообщение</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
        <span className="error text-red-500 text-sm" id="message-error">{errors.message}</span>
      </div>

      <div className="mb-4">
        <label htmlFor="file" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Прикрепить файл</label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 dark:file:bg-blue-700 file:text-blue-700 dark:file:text-blue-200
            hover:file:bg-blue-100 dark:hover:file:bg-blue-600"
        />
        <span className="error text-red-500 text-sm" id="file-error">{errors.file}</span>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="flex items-center bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Отправить
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
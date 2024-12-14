import React, { useState, useRef } from "react";
import "../styles.css";
import "../mockCallAPI.css";

type FormValues = { category: string; message: string; file: File | null }


const FeedbackForm: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    category: "",
    message: "",
    file: null,
  });

  const [errors, setErrors] = useState({
    category: "",
    message: "",
    file: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formDataDiv = useRef<HTMLDivElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormValues({
      ...formValues,
      file,
    });
  };

  const validateForm = (formData: FormValues) => {
    let formErrors = { category: "", message: "", file: "" };

    if (!formData.file) {
      formErrors.file = "Пожалуйста, прикрепите файл";
    }

    return formErrors;
  };

  const displayFormData = (
    formData: FormValues,
    formDataDiv: React.RefObject<HTMLDivElement | null>
  ) => {
    if (formDataDiv.current) {
      formDataDiv.current.innerHTML = "";
    }

    const infoBlock = document.createElement("div");
    infoBlock.className = "p-2 mt-1 rounded";

    infoBlock.innerHTML = `
      <h2 class="flex justify-center text-lg font-bold mb-2">ДАННЫЕ ФОРМЫ</h2>
      <p><strong>Тема сообщения:</strong> ${formData.category}</p>
      <p><strong>Сообщение:</strong> ${formData.message}</p>
      ${formData.file ? `<p><strong>File Name:</strong> ${formData.file.name}</p>` : ""}
    `;

    if (formDataDiv.current) {
      formDataDiv.current.appendChild(infoBlock);
    }
  };

  const toggleLoader = () => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.toggle("hidden");
    }
  };

  const submitForm = async (
    formData: FormData,
    formElement: HTMLFormElement,
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://158.160.155.135/api/feedback", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setIsSubmitted(true);
        displayFormData(formValues, formDataDiv);
        setFormValues({ category: "", message: "", file: null });
        formElement.reset();
      } else {
        alert(result.detail || "Произошла ошибка при отправке формы.");
      }
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      alert("Произошла ошибка при отправке формы.");
    } finally {
      toggleLoader();
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let formErrors = validateForm(formValues);
    setErrors(formErrors);

    if (formErrors.file) {
      setIsSubmitted(false);
      return;
    }
    setIsSubmitted(false);
    toggleLoader();

    const formData = new FormData();
    const formElement = event.target as HTMLFormElement;
    formData.append("category", formValues.category);
    formData.append("message", formValues.message);
    if (formValues.file) {
      formData.append("file", formValues.file);
    }

    submitForm(formData, formElement);
  };

  return (
    <form
      id="feedback-form"
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded"
    >
      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-gray-700 dark:text-gray-200 font-bold mb-2"
        >
          Тема сообщения
        </label>
        <select
          id="category"
          name="category"
          required
          value={formValues.category}
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
        <span className="error text-red-500 text-sm" id="category-error">
          {errors.category}
        </span>
      </div>

      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-gray-700 dark:text-gray-200 font-bold mb-2"
        >
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={formValues.message}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
        <span className="error text-red-500 text-sm" id="message-error">
          {errors.message}
        </span>
      </div>

      <div className="mb-4">
        <label
          htmlFor="file"
          className="block text-gray-700 dark:text-gray-200 font-bold mb-2"
        >
          Прикрепить файл
        </label>
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
        <span className="error text-red-500 text-sm" id="file-error">
          {errors.file}
        </span>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`flex items-center bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          Отправить
        </button>
      </div>
      <div id="loader" className="tems-center font-bold text-lg hidden">
        Отправляем
        <span className="inline-block"></span>
      </div>
      <div
        ref={formDataDiv}
        className={`border-2 border-sky-500 my-5 ${isSubmitted ? "" : "hidden"}`}
      ></div>
    </form>
  );
};

export default FeedbackForm;

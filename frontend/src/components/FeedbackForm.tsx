import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { MAX_MESSAGE_LENGTH, MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from '../constants';

const schema = z.object({
  category: z.string().nonempty('Пожалуйста, выберите тему сообщения.'),
  message: z.string().nonempty('Пожалуйста, введите сообщение.').max(MAX_MESSAGE_LENGTH, `Сообщение не должно превышать ${MAX_MESSAGE_LENGTH} символов`),
  file: z
    .any()
    .refine((file) => !file || (file.size <= MAX_FILE_SIZE && ALLOWED_MIME_TYPES.includes(file.type)), 'Файл не должен превышать 5 МБ и должен быть типа JPEG, PNG, PDF')
    .optional(),
});


type Schema = z.infer<typeof schema>;

const categoryOptions = [
  { value: 'general', label: 'Общий вопрос' },
  { value: 'technical', label: 'Сообщение об ошибке' },
  { value: 'course', label: 'Курс и обучение' },
  { value: 'other', label: 'Другое' },
];

const submitFeedback = async (formData: FormData) => {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  } else {
    throw new Error(result.detail || 'Произошла ошибка при отправке формы.');
  }
};


const FeedbackForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, control, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: categoryOptions[0].value,
    }
  });

  const onSubmit = async (data: Schema) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('message', data.message);
    if (data.file && data.file) {
      formData.append('file', data.file);
    }

    const promise = () => submitFeedback(formData);

    toast.promise(promise, {
      loading: 'Отправка...',
      success: () => 'Форма успешно отправлена',
      error: () => 'Произошла ошибка при отправке формы.',
      finally: () => {
        setIsSubmitting(false);
      }
    })
  };


  return (
    <form id="feedback-form" onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded">
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Тема сообщения</label>
        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <select
              id="category"
              {...field}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
        {errors.category && <span className="error text-red-500 text-sm">{errors.category.message}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Сообщение</label>
        <Controller
          name="message"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <textarea
              id="message"
              rows={5}
              {...field}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          )}
        />
        {errors.message && <span className="error text-red-500 text-sm">{errors.message.message}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="file" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Прикрепить файл</label>
        <Controller
          name="file"
          control={control}
          render={({ field: { value, onChange, disabled, ...field } }) => (
            <input
              type="file"
              id="file"
              disabled={disabled || isSubmitting}
              {...field}
              value={value?.filename}
              onChange={(event) => {
                event.target.files && onChange(event.target.files[0]);
              }}
              className="block w-full text-sm text-gray-500 dark:text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 dark:file:bg-blue-700 file:text-blue-700 dark:file:text-blue-200
                enabled:hover:file:bg-blue-100 dark:enabled:hover:file:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          )}
        />
        {errors.file && <span className="error text-red-500 text-sm">{errors.file.message as string}</span>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center bg-blue-500 enabled:hover:bg-blue-700 dark:bg-blue-600 dark:enabled:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedback-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Очистка предыдущих ошибок
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach((el) => {
      el.textContent = '';
    });

    // Сбор данных формы
    const category = document.getElementById('category').value;
    const message = document.getElementById('message').value.trim();
    const fileInput = document.getElementById('file');
    const file = fileInput.files ? fileInput.files[0] : null;

    let isValid = true;

    // Валидация категории
    if (!category) {
      const categoryError = document.getElementById('category-error');
      categoryError.textContent = 'Пожалуйста, выберите тему сообщения.';
      isValid = false;
    }

  
    // Валидация сообщения
    if (!message) {
      const messageError = document.getElementById('message-error');
      messageError.textContent = 'Пожалуйста, введите сообщение.';
      isValid = false;
    }

    // Валидация файла
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        const fileError = document.getElementById('file-error');
        fileError.textContent = 'Допустимые типы файлов: JPEG, PNG, PDF.';
        isValid = false;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        const fileError = document.getElementById('file-error');
        fileError.textContent = 'Максимальный размер файла: 5MB.';
        isValid = false;
      }
    }

    if (isValid) {
      // Локальная обработка данных формы
      const formData = new FormData(form);
      const data = {
        category: formData.get('category'),
        message: formData.get('message'),
        file: file
          ? {
              name: file.name,
              type: file.type,
              size: file.size,
            }
          : null,
      };

      console.log('Форма отправлена:', data);

      // Очистка формы после отправки
      form.reset();
      alert('Ваше сообщение успешно отправлено!');
    }
  });

  
});
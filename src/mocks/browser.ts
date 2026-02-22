// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Создаем Service Worker для перехвата запросов в браузере
export const worker = setupWorker(...handlers);

// Функция для запуска моков
export async function enableMocking() {
  // В продакшене не запускаем
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  try {
    // Запускаем Service Worker
    await worker.start({
      onUnhandledRequest: 'bypass', // Пропускаем необработанные запросы
      quiet: false, // Показываем логи в консоли
    });
    
    console.log('✅ MSW моки запущены');
    console.log('📊 Начальные данные:', {
      tasks: (await import('./db')).db.getStats()
    });
  } catch (error) {
    console.error('❌ Ошибка запуска MSW:', error);
  }
}
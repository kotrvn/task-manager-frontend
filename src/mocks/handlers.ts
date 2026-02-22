// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { db } from './db';

// Используем относительные URL, так как моки перехватывают все запросы
export const handlers = [
  // ========== TASKS ==========
  
  // GET /api/tasks - получить все задачи
  http.get('/api/tasks', () => {
    const { tasks, total } = db.getTasks();
    
    return HttpResponse.json({
      tasks,
      total,
      limit: 10,
      skip: 0
    });
  }),

  // GET /api/tasks/:id - получить задачу по ID
  http.get('/api/tasks/:id', ({ params }) => {
    try {
      const task = db.getTaskById(params.id as string);
      return HttpResponse.json(task);
    } catch (error) {
      return HttpResponse.json(
        { error: 'Задача не найдена' },
        { status: 404 }
      );
    }
  }),

  // POST /api/tasks - создать задачу
  http.post('/api/tasks', async ({ request }) => {
    try {
      const taskData = await request.json();
      const newTask = db.createTask(taskData as any);
      
      return HttpResponse.json(newTask, { 
        status: 201,
        headers: {
          'Location': `/api/tasks/${newTask.id}`
        }
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Ошибка при создании задачи' },
        { status: 400 }
      );
    }
  }),

  // PUT /api/tasks/:id - обновить задачу
  http.put('/api/tasks/:id', async ({ params, request }) => {
    try {
      const updates = await request.json();
      const updatedTask = db.updateTask(params.id as string, updates as any);
      
      return HttpResponse.json(updatedTask);
    } catch (error) {
      return HttpResponse.json(
        { error: 'Задача не найдена' },
        { status: 404 }
      );
    }
  }),

  // DELETE /api/tasks/:id - удалить задачу
  http.delete('/api/tasks/:id', ({ params }) => {
    try {
      const result = db.deleteTask(params.id as string);
      return HttpResponse.json(result);
    } catch (error) {
      return HttpResponse.json(
        { error: 'Задача не найдена' },
        { status: 404 }
      );
    }
  }),

  // ========== COMMENTS ==========
  
  // GET /api/tasks/:taskId/comments - получить комментарии задачи
  http.get('/api/tasks/:taskId/comments', ({ params }) => {
    const comments = db.getComments(params.taskId as string);
    
    return HttpResponse.json({
      comments,
      total: comments.length
    });
  }),

  // POST /api/comments - создать комментарий
  http.post('/api/comments', async ({ request }) => {
    try {
      const commentData = await request.json();
      const newComment = db.createComment(commentData as any);
      
      return HttpResponse.json(newComment, { status: 201 });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Ошибка при создании комментария' },
        { status: 400 }
      );
    }
  }),

  // PUT /api/comments/:id - обновить комментарий
  http.put('/api/comments/:id', async ({ params, request }) => {
    try {
      const { content } = await request.json() as { content: string };
      const updatedComment = db.updateComment(params.id as string, content);
      
      return HttpResponse.json(updatedComment);
    } catch (error) {
      return HttpResponse.json(
        { error: 'Комментарий не найден' },
        { status: 404 }
      );
    }
  }),

  // DELETE /api/comments/:id - удалить комментарий
  http.delete('/api/comments/:id', ({ params }) => {
    try {
      const result = db.deleteComment(params.id as string);
      return HttpResponse.json(result);
    } catch (error) {
      return HttpResponse.json(
        { error: 'Комментарий не найден' },
        { status: 404 }
      );
    }
  }),

  // ========== UTILITY ==========
  
  // POST /api/reset - сбросить данные
  http.post('/api/reset', () => {
    db.reset();
    return HttpResponse.json({ 
      message: 'База данных сброшена',
      stats: db.getStats()
    });
  }),

  // GET /api/stats - получить статистику
  http.get('/api/stats', () => {
    return HttpResponse.json(db.getStats());
  }),

  // GET /api/health - проверка работоспособности
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      mock: true,
      ...db.getStats()
    });
  }),

  // ========== FALLBACK ==========
  
  // 404 для несуществующих маршрутов
  http.all('/api/*', () => {
    return HttpResponse.json(
      { error: 'Маршрут не найден' },
      { status: 404 }
    );
  })
];
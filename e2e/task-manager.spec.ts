// e2e/task-manager.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });
  
  test('должен отображать список задач', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Задачи');
    await expect(page.locator('.task-table')).toBeVisible();
  });
  
  test('должен создавать новую задачу', async ({ page }) => {
    await page.click('text=+ Новая задача');
    await page.fill('[data-testid="task-title"]', 'Тестовая задача');
    await page.fill('[data-testid="task-description"]', 'Описание тестовой задачи');
    await page.selectOption('[data-testid="task-status"]', 'todo');
    await page.selectOption('[data-testid="task-priority"]', 'high');
    await page.fill('[data-testid="task-assignee"]', 'Иван Петров');
    await page.click('text=Создать');
    
    await expect(page.locator('text=Тестовая задача')).toBeVisible();
  });
  
  test('должен фильтровать задачи по статусу', async ({ page }) => {
    await page.check('[data-testid="filter-status-todo"]');
    
    const tasks = await page.locator('.task-row').all();
    for (const task of tasks) {
      await expect(task).toHaveAttribute('data-status', 'todo');
    }
  });
  
  test('должен искать задачи по тексту', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'важная задача');
    await page.waitForTimeout(300); // debounce
    
    const taskCount = await page.locator('.task-row').count();
    expect(taskCount).toBeGreaterThan(0);
  });
  
  test('должен открывать детальную страницу задачи', async ({ page }) => {
    await page.click('.task-row:first-child a');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.comments-section')).toBeVisible();
  });
  
  test('должен добавлять комментарий к задаче', async ({ page }) => {
    await page.click('.task-row:first-child a');
    await page.fill('[data-testid="comment-input"]', 'Тестовый комментарий');
    await page.click('text=Отправить');
    
    await expect(page.locator('text=Тестовый комментарий')).toBeVisible();
  });
  
  test('должен экспортировать в PDF', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=📄 PDF');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });
  
  test('должен экспортировать в Excel', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=📊 Excel');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.xlsx');
  });
  
  test('должен переключать страницы пагинации', async ({ page }) => {
    await page.click('text=2');
    await expect(page.url()).toContain('page=2');
  });
  
  test('должен редактировать задачу', async ({ page }) => {
    await page.click('.task-row:first-child a');
    await page.click('text=Редактировать');
    await page.fill('[data-testid="task-title"]', 'Обновленное название');
    await page.click('text=Сохранить');
    
    await expect(page.locator('text=Обновленное название')).toBeVisible();
  });
  
  test('должен удалять задачу', async ({ page }) => {
    const taskCount = await page.locator('.task-row').count();
    await page.click('.task-row:first-child [data-testid="delete-task"]');
    await page.click('text=Подтвердить');
    
    const newCount = await page.locator('.task-row').count();
    expect(newCount).toBe(taskCount - 1);
  });
  
  test('должен сортировать задачи', async ({ page }) => {
    await page.click('[data-testid="sort-title"]');
    await page.waitForTimeout(300);
    
    const titles = await page.locator('.task-title').allTextContents();
    const sorted = [...titles].sort();
    expect(titles).toEqual(sorted);
  });
  
  test('должен фильтровать по нескольким критериям', async ({ page }) => {
    await page.check('[data-testid="filter-status-todo"]');
    await page.check('[data-testid="filter-priority-high"]');
    await page.fill('[data-testid="search-input"]', 'срочно');
    await page.waitForTimeout(300);
    
    const tasks = await page.locator('.task-row').all();
    for (const task of tasks) {
      await expect(task).toHaveAttribute('data-status', 'todo');
      await expect(task).toHaveAttribute('data-priority', 'high');
    }
  });
});
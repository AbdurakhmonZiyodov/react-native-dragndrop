import { SQLiteDatabase } from 'expo-sqlite';
import { Task } from './@types/todo.types';

export async function initializeDB(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      PRAGMA journal_mode=WAL;

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT (datetime('now', 'localtime')),
        isDone BOOLEAN DEFAULT 0,
        position INTEGER,  
        UNIQUE (id, position)
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export async function addTask(
  db: SQLiteDatabase,
  taskName: string,
): Promise<void> {
  try {
    // Get the current maximum position
    const maxPositionQuery = 'SELECT MAX(position) AS maxPosition FROM tasks;';
    const result = (await db.getFirstAsync(maxPositionQuery)) as {
      maxPosition: null | number;
    };

    // Determine the next position
    const nextPosition =
      result.maxPosition !== null && typeof result.maxPosition === 'number'
        ? result.maxPosition + 1
        : 0;

    // Prepare and execute the insert query
    const query = 'INSERT INTO tasks (name, position) VALUES (?, ?);';
    await db.runAsync(query, [taskName, nextPosition]);
  } catch (error) {
    console.error('Error adding task:', error);
    throw new Error('Failed to add task.'); // Rethrow or handle as needed
  }
}

export async function deleteTask(
  db: SQLiteDatabase,
  taskId: number,
): Promise<void> {
  const query = 'DELETE FROM tasks WHERE id = ?;';
  await db.runAsync(query, [taskId]);
}

export async function editTask(
  db: SQLiteDatabase,
  taskId: number,
  newTaskName: string,
): Promise<void> {
  const query = 'UPDATE tasks SET name = ? WHERE id = ?;';
  await db.runAsync(query, [newTaskName, taskId]);
}

export async function updateTaskPosition(
  db: SQLiteDatabase,
  taskId: number,
  newPosition: number,
): Promise<void> {
  const query = 'UPDATE tasks SET position = ? WHERE id = ?;';
  await db.runAsync(query, [newPosition, taskId]);
}

export async function toggleTaskStatus(
  db: SQLiteDatabase,
  taskId: number,
): Promise<void> {
  const query = 'UPDATE tasks SET isDone = NOT isDone WHERE id = ?;';
  await db.runAsync(query, [taskId]);
}

export async function getTasks(db: SQLiteDatabase): Promise<Task[]> {
  const query = 'SELECT * FROM tasks ORDER BY position;';
  const result = await db.getAllAsync(query);
  return result as Task[]; // Cast result to Task[]
}

export async function removeAllTasks(db: SQLiteDatabase): Promise<void> {
  try {
    const query = 'DELETE FROM tasks;';
    await db.runAsync(query);
    console.log('All tasks removed successfully.');
  } catch (error) {
    console.error('Error removing tasks:', error);
    throw new Error('Failed to remove all tasks.'); // Rethrow or handle as needed
  }
}

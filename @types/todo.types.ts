export interface Task {
  id: number; // Unique identifier for the task
  name: string; // The name of the task
  created_at: string; // Creation date in string format
  isDone: number; // Status of the task (0 if not done, 1 if done)
  position: number; // Position for ordering tasks
}

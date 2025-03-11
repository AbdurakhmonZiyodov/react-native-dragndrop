import { SQLiteDatabase } from 'expo-sqlite';
import { makeAutoObservable } from 'mobx';
import { Alert } from 'react-native';
import { Task } from '../@types/todo.types';
import {
  addTask,
  getTasks,
  updateTaskPosition,
  deleteTask as dbDeleteTask,
  toggleTaskStatus,
  editTask as dbEditTask,
} from '../db';
import { find } from 'lodash';

class TodoStore {
  public list: Task[] = []; // todo list

  public modalVisiblity: boolean = false; // (show || hide) modal
  public selectedTask: Task | null = null; // edit task

  public inputValue: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  // Update the task list with a new array
  private updateList(newList: Task[]) {
    this.list = newList;
  }

  // Initialize the task list from the database
  public initialize = async (db: SQLiteDatabase) => {
    try {
      const tasks = await getTasks(db);
      if (tasks) {
        this.updateList(tasks);
      }
    } catch (error) {
      console.error('[Error-initialize]:', error);
    }
  };

  // Create a new task
  public createTask = async (db: SQLiteDatabase) => {
    if (!this.inputValue) {
      Alert.alert('Oops!', 'Please enter a valid task!');
      return;
    }

    try {
      await addTask(db, this.inputValue);
      await this.initialize(db);
    } catch (error) {
      console.error('[Error-create]:', error);
      Alert.alert('Oops!', 'Failed to create task. Please try again.');
    }
  };

  // Delete a task
  public deleteTask = async (db: SQLiteDatabase, taskId: number) => {
    try {
      await dbDeleteTask(db, taskId); // Delete from database
      // Update the list in the store
      this.updateList(this.list.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('[Error-deleteTask]:', error);
      Alert.alert('Oops!', 'Failed to delete task. Please try again.');
    }
  };

  // Edit a task
  public editTask = async (db: SQLiteDatabase) => {
    if (!this.inputValue.trim()) {
      Alert.alert('Oops!', 'Please enter a valid task!');
      return;
    }

    if (!this.selectedTask) return;
    const taskId = this.selectedTask.id;

    try {
      await dbEditTask(db, taskId, this.inputValue);
      const updatedList = this.list.map((task) =>
        task.id === taskId ? { ...task, name: this.inputValue } : task,
      );
      this.updateList(updatedList);
    } catch (error) {
      console.error('[Error-editTask]:', error);
      Alert.alert('Oops!', 'Failed to edit task. Please try again.');
    }
  };

  // Toggle the isDone status of a task
  public toggleTask = async (db: SQLiteDatabase, taskId: number) => {
    try {
      await toggleTaskStatus(db, taskId); // Update in the database
      // Update the list in the store
      const updatedList = this.list.map((task) =>
        task.id === taskId ? { ...task, isDone: Number(!task.isDone) } : task,
      );
      this.updateList(updatedList);
    } catch (error) {
      console.error('[Error-toggleTask]:', error);
    }
  };

  public findOneTask = (taskId: number) => {
    const result = find(this.list, { id: taskId });

    return !result ? null : result;
  };

  // Update task positions in the database after drag-and-drop
  public updateTaskPositions = async (db: SQLiteDatabase, newOrder: Task[]) => {
    this.updateList(newOrder); // Update the list in the store with the new order

    try {
      await Promise.all(
        newOrder.map((task, index) => updateTaskPosition(db, task.id, index)),
      );
      console.log('Positions updated successfully in the database');
    } catch (error) {
      console.error('[Error-updateTaskPositions]:', error);
      Alert.alert(
        'Oops!',
        'Failed to update task positions. Please try again.',
      );
    }
  };

  // change input
  changeInput = (newValue: string) => {
    this.inputValue = newValue;
  };

  // modal
  showModal = (task: Task | null = null) => {
    this.modalVisiblity = true; // show modal
    this.selectedTask = task;

    if (this.selectedTask) {
      this.changeInput(this.selectedTask.name);
    }
  };

  hideModal = () => {
    this.modalVisiblity = false; // hide modal
    this.selectedTask = null; // clear selected value
    this.inputValue = ''; // clear input
  };
}

export const todoStore = new TodoStore();

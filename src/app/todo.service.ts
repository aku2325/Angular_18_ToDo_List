import { Injectable } from '@angular/core'; // Angular's dependency injection system
import { Observable, of } from 'rxjs'; // Observable and 'of' operator from RxJS for reactive programming
import { catchError, map } from 'rxjs/operators'; // Operators to handle errors and transform data

// Interface representing the structure of a Todo item
export interface Todo {
  id: number;        // Unique identifier for the todo item
  title: string;     // The title or description of the todo
  completed: boolean; // A boolean flag indicating if the todo is completed or not
}

// The @Injectable decorator marks this service as available to be injected throughout the app
@Injectable({
  providedIn: 'root' // The service is provided in the root module, making it available app-wide
})
export class TodoService {
  private todos: Todo[] = [];  // In-memory array to store the list of todos
  private nextId = 1;          // Variable to generate unique IDs for each new todo item

  // Constructor is empty because we don't need any dependencies for this service
  constructor() {}

  /**
   * Adds a new todo item to the list.
   * @param title - The title of the new todo.
   * @returns Observable<Todo> - Returns the added todo as an observable.
   */
  addTodo(title: string): Observable<Todo> {
    // Create a new todo object with a unique ID, title, and default 'completed' status of false
    const newTodo: Todo = { id: this.nextId++, title, completed: false };
    this.todos.push(newTodo); // Push the new todo into the list

    // Return the newly created todo wrapped in an observable
    return of(newTodo).pipe(
      map(todo => todo), // 'map' operator passes the todo object forward
      catchError(this.handleError) // If any error occurs, catch it and handle it
    );
  }

  /**
   * Retrieves the list of todos.
   * @returns Observable<Todo[]> - Returns the list of todos as an observable.
   */
  getTodos(): Observable<Todo[]> {
    // Return the entire list of todos wrapped in an observable
    return of(this.todos).pipe(
      map(todos => todos), // 'map' operator passes the todos list forward
      catchError(this.handleError) // If any error occurs, catch it and handle it
    );
  }

  /**
   * Updates a specific todo item.
   * @param id - The ID of the todo item to update.
   * @param updatedTodo - An object containing updated fields.
   * @returns Observable<Todo | undefined> - Returns the updated todo or undefined if not found.
   */
  updateTodo(id: number, updatedTodo: Partial<Todo>): Observable<Todo | undefined> {
    // Find the todo item by ID
    const todo = this.todos.find(t => t.id === id);

    // If the todo exists, update its properties with the values from 'updatedTodo'
    if (todo) {
      Object.assign(todo, updatedTodo); // Update the existing todo with new values

      // Return the updated todo wrapped in an observable
      return of(todo).pipe(
        map(todo => todo), // 'map' operator passes the updated todo object forward
        catchError(this.handleError) // Catch and handle any errors that occur
      );
    }

    // If the todo is not found, return 'undefined'
    return of(undefined).pipe(catchError(this.handleError));
  }

  /**
   * Deletes a todo item by its ID.
   * @param id - The ID of the todo item to delete.
   * @returns Observable<boolean> - Returns true if deleted, false if not found.
   */
  deleteTodo(id: number): Observable<boolean> {
    // Find the index of the todo item to delete
    const index = this.todos.findIndex(t => t.id === id);

    // If the todo is found, remove it from the array
    if (index !== -1) {
      this.todos.splice(index, 1); // Remove the todo from the list
      return of(true).pipe(
        catchError(this.handleError) // Catch and handle any errors that occur
      );
    }

    // If the todo is not found, return false
    return of(false).pipe(catchError(this.handleError));
  }

  /**
   * Handles errors by logging them and throwing a new error.
   * @param error - The error object.
   * @returns Observable<never> - Returns an observable that throws an error.
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error); // Log the error to the console for debugging
    throw new Error('Something went wrong; please try again later.'); // Throw a new error message
  }
}

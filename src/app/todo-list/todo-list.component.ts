import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo, TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list', // Custom HTML tag for this component
  standalone: true, // This component is standalone and doesn't need an NgModule
  imports: [CommonModule, ReactiveFormsModule], // Modules imported for this component
  templateUrl: './todo-list.component.html', // Path to the HTML template
  styleUrls: ['./todo-list.component.css'] // Path to the CSS styles
})
export class TodoListComponent implements OnInit {
  todos$!: Observable<Todo[]>; // Observable that holds the list of todos
  todoForm: FormGroup; // Form group for managing the todo form
  editingTodo: Todo | null = null; // Current todo being edited, or null if not editing

  constructor(private todoService: TodoService, private fb: FormBuilder) { 
    // Initialize the form group with a 'title' form control
    this.todoForm = this.fb.group({
      title: ['']
    });
  }

  ngOnInit(): void {
    // Load the todos when the component initializes
    this.todos$ = this.todoService.getTodos();
  }

  addTodo(): void {
    const title = this.todoForm.get('title')?.value.trim();
    // Add a new todo if the title is not empty
    if (title) {
      this.todoService.addTodo(title).pipe(
        map(() => this.loadTodos()) // Reload todos after adding
      ).subscribe(() => this.todoForm.reset()); // Reset form after adding
    }
  }

  editTodo(todo: Todo): void {
    // Set the current todo for editing and update the form
    this.editingTodo = todo;
    this.todoForm.setValue({ title: todo.title });
  }

  saveTodo(): void {
    // Update the todo if there is an editingTodo
    if (this.editingTodo) {
      const updatedTitle = this.todoForm.get('title')?.value.trim();
      if (updatedTitle) {
        this.todoService.updateTodo(this.editingTodo.id, { title: updatedTitle }).pipe(
          map(() => this.loadTodos()) // Reload todos after updating
        ).subscribe(() => {
          this.editingTodo = null; // Clear editing state
          this.todoForm.reset(); // Reset form after saving
        });
      }
    }
  }

  toggleCompletion(todo: Todo): void {
    // Toggle the completion status of a todo
    this.todoService.updateTodo(todo.id, { completed: !todo.completed }).pipe(
      map(() => this.loadTodos()) // Reload todos after updating
    ).subscribe();
  }

  deleteTodo(todo: Todo): void {
    // Delete the specified todo
    this.todoService.deleteTodo(todo.id).pipe(
      map(() => this.loadTodos()) // Reload todos after deletion
    ).subscribe();
  }

  private loadTodos(): void {
    // Refresh the list of todos
    this.todos$ = this.todoService.getTodos();
  }
}

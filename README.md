# TaskBoard: Kanban Task Management
THis TaskBoard is for managing tasks and projects. It features real-time updates, drag-and-drop task management, and Advanced filtering/sorting capabilities.

## Screenshot
![TaskMaster Dashboard](screenshots/dashboard.png)


## Features
- Create, edit, delete boards and tasks
- Drag-and-drop tasks within/across columns
- Real-time updates with `BoardContext` and local storage
- Filter tasks by priority/date, sort boards by columns
- Responsive UI with modals and toast notifications
- My Tasks page for user-assigned tasks
- Settings page for user profile (placeholder)

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, React Router, React Icons
- **State Management**: Custom `BoardContext`
- **Build Tool**: Vite


## Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/SahilAli8808/Emitrr-TaskBoard
   cd taskmaster
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173`.

## Usage
- **Dashboard**: View board/task metrics, navigate to boards.
- **Board View**: Manage boards (create/delete) in a table.
- **Board Detail**: Drag/drop tasks, add/edit/delete tasks/columns.
- **My Tasks**: View user tasks with due-soon filter.
- **Settings**: View user-related board count (placeholder).


## Evaluation Notes
- **Code Quality**: Type-safe, modular, reusable components.
- **Functionality**: Drag-and-drop, filtering, sorting, and CRUD operations work seamlessly.
- **Performance**: Optimized with context and local storage.
- **UI/UX**: Responsive, intuitive, with clear feedback.
- **Scalability**: Ready for backend integration (e.g., MongoDB).


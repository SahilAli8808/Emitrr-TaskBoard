import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Board, Column, Task } from "../types/board";

interface BoardContextType {
  board?: Board;
  boards: Board[];
  loadBoard: (id: string) => void;
  addBoard: (name: string, description: string) => void;
  deleteBoard: (id: string) => void;
  addColumn: (name: string) => void;
  deleteColumn: (colId: string) => void;
  addTask: (colId: string, task: Omit<Task, "id" | "createdBy">) => void;
  updateTask: (colId: string, task: Task) => void;
  moveTask: (fromColId: string, toColId: string, taskId: string, newIndex: number) => void;
  deleteTask: (colId: string, taskId: string) => void;
  updateColumn: (colId: string, name: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [board, setBoard] = useState<Board | undefined>();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    console.log('BoardContext useEffect: Initializing boards from localStorage');
    const all = localStorage.getItem("boards");
    const storedBoards = all ? JSON.parse(all) : [];
    localStorage.setItem("boards", JSON.stringify(storedBoards));
    setBoards(storedBoards);
  }, []);

  const persistBoards = useCallback((updatedBoards: Board[]) => {
    console.log('persistBoards: Updating boards in localStorage and state', updatedBoards.length);
    localStorage.setItem("boards", JSON.stringify(updatedBoards));
    setBoards(updatedBoards);
  }, []);

  const persistBoard = useCallback((updated: Board) => {
    console.log('persistBoard: Processing board update for ID', updated.id);
    const allBoards: Board[] = JSON.parse(localStorage.getItem("boards") || "[]");
    const currentBoard = allBoards.find(b => b.id === updated.id);
    if (currentBoard && JSON.stringify(currentBoard) === JSON.stringify(updated)) {
      console.log('persistBoard: No changes detected, skipping update');
      return;
    }
    const safeBoard = {
      ...updated,
      columns: updated.columns && updated.columns.length > 0 
        ? updated.columns 
        : [{ id: Date.now().toString() + "-default", name: "To Do", tasks: [] }],
    };
    const other = allBoards.filter(b => b.id !== updated.id);
    const updatedBoards = [...other, safeBoard];
    console.log('persistBoard: Persisting updated boards', updatedBoards.length);
    persistBoards(updatedBoards);
    setBoard(safeBoard);
  }, [persistBoards]);

  const addBoard = useCallback((name: string, description: string) => {
    console.log('addBoard: Creating new board', name);
    const newBoard: Board = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      columns: [{ id: Date.now().toString() + "-default", name: "To Do", tasks: [] }],
    };
    const updatedBoards = [...boards, newBoard];
    persistBoards(updatedBoards);
    setBoard(newBoard);
  }, [boards, persistBoards]);

  const deleteBoard = useCallback((id: string) => {
    console.log('deleteBoard: Deleting board', id);
    const updatedBoards = boards.filter(b => b.id !== id);
    persistBoards(updatedBoards);
    if (board?.id === id) {
      setBoard(updatedBoards[0] || undefined);
    }
  }, [board, boards, persistBoards]);

  const loadBoard = useCallback((id: string) => {
    console.log('loadBoard: Loading board', id);
    const allBoards: Board[] = JSON.parse(localStorage.getItem("boards") || "[]");
    const found = allBoards.find(b => b.id === id);
    if (found) {
      console.log('loadBoard: Found board', id, 'with', found.columns?.length || 0, 'columns');
      setBoard(found); // Only set board, let persistBoard handle default columns
    } else {
      console.log('loadBoard: Board not found', id);
    }
  }, []);

  const addColumn = useCallback((name: string) => {
    if (!board) {
      console.log('addColumn: No board selected, skipping');
      return;
    }
    console.log('addColumn: Adding column', name, 'to board', board.id);
    const col: Column = { id: Date.now().toString(), name, tasks: [] };
    persistBoard({ ...board, columns: [...(board.columns ?? []), col] });
  }, [board, persistBoard]);

  const deleteColumn = useCallback((colId: string) => {
    if (!board) return;
    console.log('deleteColumn: Deleting column', colId, 'from board', board.id);
    persistBoard({
      ...board,
      columns: (board.columns ?? []).filter(c => c.id !== colId),
    });
  }, [board, persistBoard]);

  const addTask = useCallback((colId: string, t: Omit<Task, "id">) => {
  if (!board) return;
  console.log('addTask: Adding task to column', colId, 'in board', board.id);
  const newTask: Task = {
    ...t,
    id: Date.now().toString(),
  };
  persistBoard({
    ...board,
    columns: (board.columns ?? []).map(c =>
      c.id === colId ? { ...c, tasks: [...c.tasks, newTask] } : c
    ),
  });
}, [board, persistBoard]);


  const updateTask = useCallback((colId: string, task: Task) => {
    if (!board) return;
    console.log('updateTask: Updating task', task.id, 'in column', colId);
    persistBoard({
      ...board,
      columns: (board.columns ?? []).map(c =>
        c.id === colId
          ? {
              ...c,
              tasks: c.tasks.map(t =>
                t.id === task.id ? task : t
              ),
            }
          : c
      ),
    });
  }, [board, persistBoard]);

  const moveTask = useCallback((fromColId: string, toColId: string, taskId: string, newIndex: number) => {
    if (!board) return;
    console.log('moveTask: Moving task', taskId, 'from', fromColId, 'to', toColId, 'at index', newIndex);
    const fromColumn = (board.columns ?? []).find(c => c.id === fromColId);
    const toColumn = (board.columns ?? []).find(c => c.id === toColId);
    if (!fromColumn || !toColumn) return;

    const task = fromColumn.tasks.find(t => t.id === taskId);
    if (!task) return;

    let updatedColumns = board.columns ?? [];
    
    if (fromColId === toColId) {
      const tasks = [...fromColumn.tasks];
      const sourceIndex = tasks.findIndex(t => t.id === taskId);
      if (sourceIndex === -1) return;
      const [movedTask] = tasks.splice(sourceIndex, 1);
      const adjustedIndex = sourceIndex < newIndex ? newIndex : newIndex;
      tasks.splice(adjustedIndex, 0, movedTask);
      updatedColumns = updatedColumns.map(c =>
        c.id === fromColId ? { ...c, tasks } : c
      );
    } else {
      const fromTasks = fromColumn.tasks.filter(t => t.id !== taskId);
      const toTasks = [...toColumn.tasks];
      toTasks.splice(newIndex, 0, task);
      updatedColumns = updatedColumns.map(c =>
        c.id === fromColId ? { ...c, tasks: fromTasks } :
        c.id === toColId ? { ...c, tasks: toTasks } : c
      );
    }

    persistBoard({
      ...board,
      columns: updatedColumns,
    });
  }, [board, persistBoard]);

  const deleteTask = useCallback((colId: string, taskId: string) => {
    if (!board) return;
    console.log('deleteTask: Deleting task', taskId, 'from column', colId);
    persistBoard({
      ...board,
      columns: (board.columns ?? []).map(c =>
        c.id === colId
          ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) }
          : c
      ),
    });
  }, [board, persistBoard]);

  const updateColumn = useCallback((colId: string, name: string) => {
    if (!board) return;
    console.log('updateColumn: Updating column', colId, 'to name', name);
    persistBoard({
      ...board,
      columns: (board.columns ?? []).map(c =>
        c.id === colId ? { ...c, name } : c
      ),
    });
  }, [board, persistBoard]);

  return (
    <BoardContext.Provider
      value={{
        board,
        boards,
        loadBoard,
        addBoard,
        deleteBoard,
        addColumn,
        deleteColumn,
        addTask,
        updateTask,
        moveTask,
        deleteTask,
        updateColumn,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used within BoardProvider");
  return ctx;
};
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Board, Column, Task } from "../types/board";

interface BoardContextType {
  board?: Board;
  loadBoard: (id: string) => void;
  addColumn: (name: string) => void;
  deleteColumn: (colId: string) => void;
  addTask: (colId: string, task: Omit<Task, "id" | "createdBy">) => void;
  updateTask: (colId: string, task: Task) => void;
  moveTask: (fromColId: string, toColId: string, taskId: string, newIndex: number) => void;
  deleteTask: (colId: string, taskId: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [board, setBoard] = useState<Board | undefined>();

  useEffect(() => {
    const all = localStorage.getItem("boards");
    localStorage.setItem("boards", all ?? "[]");
  }, []);

  const persistBoard = (updated: Board) => {
    const allBoards: Board[] = JSON.parse(localStorage.getItem("boards")!);
    const other = allBoards.filter(b => b.id !== updated.id);
    const safeBoard = {
      ...updated,
      columns: updated.columns ?? [],
    };
    localStorage.setItem("boards", JSON.stringify([...other, safeBoard]));
    setBoard(safeBoard);
  };

  const loadBoard = (id: string) => {
    const allBoards: Board[] = JSON.parse(localStorage.getItem("boards")!);
    const found = allBoards.find(b => b.id === id);
    if (found) {
      setBoard({
        ...found,
        columns: found.columns ?? [],
      });
    }
  };

  const addColumn = (name: string) => {
    if (!board) return;
    const col: Column = { id: Date.now().toString(), name, tasks: [] };
    persistBoard({ ...board, columns: [...(board.columns ?? []), col] });
  };

  const deleteColumn = (colId: string) => {
    if (!board) return;
    persistBoard({
      ...board,
      columns: (board.columns ?? []).filter(c => c.id !== colId),
    });
  };

  const addTask = (colId: string, t: Omit<Task, "id" | "createdBy">) => {
    if (!board) return;
    const newTask: Task = {
      ...t,
      id: Date.now().toString(),
      createdBy: "Emitrr",
    };
    persistBoard({
      ...board,
      columns: (board.columns ?? []).map(c =>
        c.id === colId ? { ...c, tasks: [...c.tasks, newTask] } : c
      ),
    });
  };

  const updateTask = (colId: string, task: Task) => {
    if (!board) return;
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
  };

  const moveTask = (
    fromCol: string,
    toCol: string,
    taskId: string,
    newIndex: number
  ) => {
    if (!board) return;

    const from = (board.columns ?? []).find(c => c.id === fromCol);
    const to = (board.columns ?? []).find(c => c.id === toCol);
    if (!from || !to) return;

    const task = from.tasks.find(t => t.id === taskId);
    if (!task) return;

    const without = from.tasks.filter(t => t.id !== taskId);
    const inserted = [...to.tasks];
    inserted.splice(newIndex, 0, task);

    persistBoard({
      ...board,
      columns: (board.columns ?? []).map(c =>
        c.id === fromCol
          ? { ...c, tasks: without }
          : c.id === toCol
          ? { ...c, tasks: inserted }
          : c
      ),
    });
  };

  const deleteTask = (colId: string, taskId: string) => {
    if (!board) return;
    persistBoard({
      ...board,
      columns: (board.columns ?? []).map(c =>
        c.id === colId
          ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) }
          : c
      ),
    });
  };

  return (
    <BoardContext.Provider
      value={{
        board,
        loadBoard,
        addColumn,
        deleteColumn,
        addTask,
        updateTask,
        moveTask,
        deleteTask,
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

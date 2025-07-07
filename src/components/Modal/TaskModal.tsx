import React, { useState, FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Modal({ open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

type TaskData = {
  title: string;
  description: string;
  createdBy: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
};

type TaskModalContentProps = {
  title?: string;
  onSubmit: (data: TaskData) => void;
};

export function TaskModalContent({ title = 'Create Task', onSubmit }: TaskModalContentProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim() && createdBy.trim() && dueDate) {
      onSubmit({ title: taskTitle, description, createdBy, priority, dueDate });
    }
  };

  return (
    
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none max-h-[80vh] overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
          <Dialog.Close className="text-gray-400 hover:text-gray-500">
            <Cross1Icon />
          </Dialog.Close>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Task Title</label>
    <input
      type="text"
      value={taskTitle}
      onChange={(e) => setTaskTitle(e.target.value)}
      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Description</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={1}
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Created By</label>
    <input
      type="text"
      value={createdBy}
      onChange={(e) => setCreatedBy(e.target.value)}
      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div className="flex gap-4">
    <div className="w-1/2">
      <label className="block text-sm font-medium text-gray-700">Priority</label>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>

    <div className="w-1/2">
      <label className="block text-sm font-medium text-gray-700">Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  </div>

  <button
    type="submit"
    className="mt-2 w-full bg-yellow-400 text-white py-2 rounded-md hover:bg-yellow-300 transition"
  >
    Create Task
  </button>
</form>

      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default Modal;

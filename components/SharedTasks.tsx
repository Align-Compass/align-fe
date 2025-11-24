import React, { useState } from 'react';
import { Task, User } from '../types';

interface Props {
  tasks: Task[];
  users: User[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, assigneeId: string | null) => void;
}

const SharedTasks: React.FC<Props> = ({ tasks, users, onToggleTask, onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [assignee, setAssignee] = useState<string>('anyone');

  const handleAdd = () => {
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle, assignee === 'anyone' ? null : assignee);
    setNewTaskTitle('');
  };

  const getAvatar = (userId: string | null) => {
    if (!userId) return <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-gray-600 border-2 border-white">Tod</div>;
    const user = users.find(u => u.id === userId);
    return user ? <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border-2 border-white" /> : null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col">
      <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        Tarefas Compartilhadas
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-64 custom-scrollbar">
        {tasks.map(task => (
          <div key={task.id} className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${task.completed ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <button 
                onClick={() => onToggleTask(task.id)}
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-blue-500'}`}
              >
                {task.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </button>
              <span className={`text-sm truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {task.title}
              </span>
            </div>
            <div className="flex-shrink-0 ml-2">
               {getAvatar(task.assignedToUserId)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex gap-2 mb-2">
            <select 
                value={assignee} 
                onChange={(e) => setAssignee(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
                <option value="anyone">Todos</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Nova tarefa..."
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button 
            onClick={handleAdd}
            className="bg-secondary hover:bg-teal-500 text-white rounded-lg px-3 py-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedTasks;
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Layers,
  Loader,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import React from 'react';
import { TaskApi } from './api/index';
import { Task } from './types/index';

export const TasksView: React.FC = () => {
  const TASKS = TaskApi.list();

  const getStatusDisplay = (task: Task) => {
    if (task.progress === 1.0)
      return {
        label: 'Completed',
        color: 'bg-green-50 text-green-600',
        icon: <CheckCircle size={18} className="text-green-500" />,
      };
    if (task.progress === 0.0)
      return {
        label: 'Pending',
        color: 'bg-slate-100 text-slate-500',
        icon: <Clock size={18} className="text-slate-400" />,
      };
    // Heuristic: if progress < 1 but retry count is high, maybe warning
    if (task.retry_count > 2)
      return {
        label: 'Retrying',
        color: 'bg-red-50 text-red-600',
        icon: <AlertCircle size={18} className="text-red-500" />,
      };
    return {
      label: 'Running',
      color: 'bg-brand-50 text-brand-600',
      icon: <Loader size={18} className="text-brand-600 animate-spin" />,
    };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in-up">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            后台任务队列 (Task Queue)
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            系统异步任务处理状态监控。
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-sm hover:bg-white transition-colors">
            暂停队列
          </button>
          <button className="px-3 py-1.5 bg-brand-50 text-brand-600 border border-brand-100 rounded-lg text-sm hover:bg-brand-100 transition-colors flex items-center">
            <RefreshCw size={14} className="mr-1.5" /> 刷新
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {TASKS.map((task) => {
          const status = getStatusDisplay(task);
          const progressPercent = Math.round(task.progress * 100);

          return (
            <div
              key={task.id}
              className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Icon Status */}
              <div className="p-3 rounded-full bg-slate-100 flex-shrink-0 self-start sm:self-center">
                {status.icon}
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${
                      task.task_type === 'build_index'
                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                        : task.task_type === 'parse'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {task.task_type}
                  </span>
                  <h4
                    className="text-sm font-bold text-slate-800 truncate"
                    title={task.doc_id}
                  >
                    {task.doc_id}
                  </h4>
                </div>

                <div className="flex items-center text-xs text-slate-500 gap-4 mb-2">
                  <span className="flex items-center" title="Page Range">
                    <Layers size={12} className="mr-1" /> P.{task.from_page} -
                    P.{task.to_page}
                  </span>
                  <span className="flex items-center" title="Duration">
                    <Clock size={12} className="mr-1" />{' '}
                    {task.process_duration.toFixed(1)}s
                  </span>
                  {task.retry_count > 0 && (
                    <span
                      className="flex items-center text-amber-600"
                      title="Retries"
                    >
                      <RefreshCw size={12} className="mr-1" /> Retry:{' '}
                      {task.retry_count}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        task.progress === 1
                          ? 'bg-green-500'
                          : task.retry_count > 2
                            ? 'bg-red-400'
                            : 'bg-brand-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-medium w-10 text-right">
                    {progressPercent}%
                  </span>
                </div>

                <div className="mt-1 text-xs text-slate-400 truncate">
                  {task.progress_msg || 'No message'}
                </div>
              </div>

              {/* Meta & Actions */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1 text-right min-w-[120px]">
                <div className="text-[10px] text-slate-400 font-mono">
                  Created: {task.create_date?.split(' ')[1]}
                </div>
                {task.begin_at && (
                  <div className="text-[10px] text-slate-400 font-mono">
                    Started: {task.begin_at.split(' ')[1]}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  {task.progress < 1 && task.progress > 0 ? (
                    <button
                      className="p-1.5 text-slate-400 hover:text-amber-500 rounded hover:bg-amber-50 transition-colors"
                      title="Pause"
                    >
                      <PauseCircle size={16} />
                    </button>
                  ) : (
                    <button
                      className="p-1.5 text-slate-400 hover:text-brand-600 rounded hover:bg-brand-50 transition-colors"
                      title="Start/Resume"
                    >
                      <PlayCircle size={16} />
                    </button>
                  )}
                  <button
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

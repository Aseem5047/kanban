import { useEffect, useMemo, useState } from 'react';
import {
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    EqualsIcon,
    TrashIcon,
} from '@heroicons/react/20/solid';

import type { Task } from '../../types/data.types';
import { useTaskStore } from '../../stores/task.store';

/* -----------------------------
   Small UI Components
------------------------------ */

const PriorityIcon = ({ priority }: { priority: Task['priority'] }) => {
    if (priority === 'high')
        return <ChevronDoubleUpIcon className="h-5 w-5 text-blue-400" />;
    if (priority === 'medium')
        return <EqualsIcon className="h-5 w-5 text-yellow-500" />;
    return <ChevronDoubleDownIcon className="h-5 w-5 text-red-500" />;
};

const AssigneeAvatar = ({ name }: { name: string }) => {
    const initials = useMemo(
        () =>
            name
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
        [name]
    );

    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
            {initials}
        </div>
    );
};

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => (
    <button
        onClick={onDelete}
        className="w-6 text-red-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
        <TrashIcon className="h-4 w-4" />
    </button>
);

/* -----------------------------
   Main Component
------------------------------ */

type TaskCardProps = {
    task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
    const updateTask = useTaskStore((s) => s.updateTask);
    const deleteTask = useTaskStore((s) => s.deleteTask);

    const tags = useTaskStore((s) => s.tags);
    const assignees = useTaskStore((s) => s.assignees);

    const addTag = useTaskStore((s) => s.addTag);
    const addAssignee = useTaskStore((s) => s.addAssignee);

    /* -----------------------------
       Local state
    ------------------------------ */
    const [title, setTitle] = useState(task.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const [isEditingAssignee, setIsEditingAssignee] = useState(false);
    const [isEditingTag, setIsEditingTag] = useState(false);

    const [assigneeInput, setAssigneeInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    /* -----------------------------
       Derived data
    ------------------------------ */
    const tag = useMemo(
        () => tags.find((t) => t.id === task.tagId),
        [tags, task.tagId]
    );

    const assignee = useMemo(
        () => assignees.find((a) => a.id === task.assigneeId),
        [assignees, task.assigneeId]
    );

    const isExpired = useMemo(
        () =>
            task.expirationDate &&
            new Date(task.expirationDate).getTime() < Date.now(),
        [task.expirationDate]
    );

    /* -----------------------------
       Effects
    ------------------------------ */
    useEffect(() => {
        setTitle(task.title);
    }, [task.title]);

    /* -----------------------------
       Task updates
    ------------------------------ */
    const saveTitle = () => {
        const trimmed = title.trim();
        if (!trimmed) return setIsEditingTitle(false);

        updateTask({ ...task, title: trimmed });
        setIsEditingTitle(false);
    };

    const updateExpiration = (value: string) => {
        updateTask({
            ...task,
            expirationDate: new Date(value),
        });
    };

    /* -----------------------------
       TAG HANDLING
    ------------------------------ */
    const handleTagSelect = (value: string) => {
        const existing = tags.find((t) =>
            t.name.toLowerCase() === value.toLowerCase()
        );

        if (existing) {
            updateTask({ ...task, tagId: existing.id });
            return;
        }

        addTag(value, '#6366f1');

        const created = useTaskStore.getState().tags.at(-1);

        if (created) {
            updateTask({ ...task, tagId: created.id });
        }
    };

    /* -----------------------------
       ASSIGNEE HANDLING
    ------------------------------ */
    const handleAssigneeSelect = (value: string) => {
        const existing = assignees.find((a) =>
            a.name.toLowerCase() === value.toLowerCase()
        );

        if (existing) {
            updateTask({ ...task, assigneeId: existing.id });
            return;
        }

        addAssignee(value);

        const created = useTaskStore.getState().assignees.at(-1);

        if (created) {
            updateTask({ ...task, assigneeId: created.id });
        }
    };

    /* -----------------------------
       Render
    ------------------------------ */
    return (
        <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('id', task.id)}
            className={`group rounded-lg border p-3 ${isExpired
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
        >
            {/* TITLE */}
            <div className="py-2 text-base">
                {isEditingTitle ? (
                    <input
                        autoFocus
                        value={title}
                        className="w-full rounded border px-1 outline-none"
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') saveTitle();
                            if (e.key === 'Escape') {
                                setTitle(task.title);
                                setIsEditingTitle(false);
                            }
                        }}
                    />
                ) : (
                    <div
                        className="cursor-pointer break-words"
                        onDoubleClick={() => setIsEditingTitle(true)}
                    >
                        {task.title}
                    </div>
                )}
            </div>

            {/* BODY */}
            <div className="space-y-3 pt-2 text-sm">
                {/* PRIORITY */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <PriorityIcon priority={task.priority} />

                        <select
                            value={task.priority}
                            onChange={(e) =>
                                updateTask({
                                    ...task,
                                    priority: e.target.value as Task['priority'],
                                })
                            }
                            className="rounded border px-1 py-0.5 text-xs"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {/* TAG + ASSIGNEE */}
                <div className="flex items-center justify-between gap-2">
                    {/* ASSIGNEE */}
                    <div className="flex items-center gap-2">
                        {!isEditingAssignee ? (
                            <button
                                onClick={() => setIsEditingAssignee(true)}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                {assignee ? (
                                    <AssigneeAvatar name={assignee.name} />
                                ) : (
                                    '+ Add assignee'
                                )}
                            </button>
                        ) : (
                            <input
                                autoFocus
                                list="assignee-list"
                                placeholder="Type assignee..."
                                value={assigneeInput}
                                onChange={(e) =>
                                    setAssigneeInput(e.target.value)
                                }
                                onBlur={() => {
                                    if (assigneeInput.trim()) {
                                        handleAssigneeSelect(
                                            assigneeInput.trim()
                                        );
                                    }
                                    setAssigneeInput('');
                                    setIsEditingAssignee(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (assigneeInput.trim()) {
                                            handleAssigneeSelect(
                                                assigneeInput.trim()
                                            );
                                        }
                                        setAssigneeInput('');
                                        setIsEditingAssignee(false);
                                    }
                                    if (e.key === 'Escape') {
                                        setAssigneeInput('');
                                        setIsEditingAssignee(false);
                                    }
                                }}
                                className="w-28 text-xs border rounded px-1"
                            />
                        )}

                        <datalist id="assignee-list">
                            {assignees.map((a) => (
                                <option key={a.id} value={a.name} />
                            ))}
                        </datalist>
                    </div>

                    {/* TAG */}
                    <div className="flex items-center gap-2">
                        {!isEditingTag ? (
                            <button
                                onClick={() => setIsEditingTag(true)}
                                className="text-xs"
                            >
                                {tag ? (
                                    <span
                                        className="rounded px-2 py-1 text-xs text-white"
                                        style={{
                                            backgroundColor: tag.color,
                                        }}
                                    >
                                        {tag.name}
                                    </span>
                                ) : (
                                    '+ Add tag'
                                )}
                            </button>
                        ) : (
                            <input
                                autoFocus
                                list="tag-list"
                                placeholder="Type tag..."
                                value={tagInput}
                                onChange={(e) =>
                                    setTagInput(e.target.value)
                                }
                                onBlur={() => {
                                    if (tagInput.trim()) {
                                        handleTagSelect(tagInput.trim());
                                    }
                                    setTagInput('');
                                    setIsEditingTag(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (tagInput.trim()) {
                                            handleTagSelect(
                                                tagInput.trim()
                                            );
                                        }
                                        setTagInput('');
                                        setIsEditingTag(false);
                                    }
                                    if (e.key === 'Escape') {
                                        setTagInput('');
                                        setIsEditingTag(false);
                                    }
                                }}
                                className="w-24 text-xs border rounded px-1"
                            />
                        )}

                        <datalist id="tag-list">
                            {tags.map((t) => (
                                <option key={t.id} value={t.name} />
                            ))}
                        </datalist>
                    </div>
                </div>

                {/* EXPIRATION + DELETE */}
                <div className="flex items-center justify-between">
                    <input
                        type="date"
                        value={new Date(task.expirationDate)
                            .toISOString()
                            .split('T')[0]}
                        onChange={(e) =>
                            updateExpiration(e.target.value)
                        }
                        className={`text-xs ${isExpired
                                ? 'font-semibold text-red-600'
                                : 'text-gray-500'
                            }`}
                    />

                    <DeleteButton
                        onDelete={() => deleteTask(task.id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
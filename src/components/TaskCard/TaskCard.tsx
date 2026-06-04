import { useMemo, useState } from 'react'
import type { Task } from '../../types/task.types'
import { useTaskStore } from '../../stores/task.store'

import AssigneeAvatar from '../Common/Avatar'
import PriorityBadge from '../Common/PriorityBadge'
import { CalendarIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useUndoStore } from '../../stores/undo.store'

type Props = {
    task: Task
}

const TaskCard = ({ task }: Props) => {

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const deleteTask = useTaskStore((s) => s.deleteTask)
    const isDeleting = useTaskStore((s) => s.isDeleting)

    const openTask = useTaskStore((s) => s.openTask)

    const tags = useTaskStore((s) => s.tags)
    const assignees = useTaskStore((s) => s.assignees)

    const tag = useMemo(
        () => tags.find((t) => t.id === task.tagId),
        [tags, task.tagId]
    )

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        useUndoStore.getState().setAction({
            type: 'delete',
            task,
            message: 'Task deleted. Undo?',
        })
        await deleteTask(task.id)
    }

    const assignee = useMemo(
        () => assignees.find((a) => a.id === task.assigneeId),
        [assignees, task.assigneeId]
    )

    const isExpired =
        task.expirationDate &&
        new Date(task.expirationDate).getTime() < Date.now()


    return (
        <div
            draggable
            onDragStart={(e) =>
                e.dataTransfer.setData('id', task.id)
            }
            onClick={() => openTask(task.id)}
            className="
                group
                relative
                min-h-[180px]
                cursor-pointer
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-slate-300
                hover:shadow-lg
            "
        >
            {/* Accent Bar */}

            {tag && (
                <div
                    className="absolute left-0 top-0 h-full w-1"
                    style={{
                        backgroundColor: tag.color,
                    }}
                />
            )}

            {/* Header */}

            <div className="flex items-center justify-between">
                {tag ? (
                    <span
                        className="
                            inline-flex
                            items-center
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-white
                        "
                        style={{
                            backgroundColor: tag.color,
                        }}
                    >
                        {tag.name}
                    </span>
                ) : (
                    <div />
                )}

                <PriorityBadge
                    priority={task.priority}
                />
            </div>

            {/* Title */}

            <h3
                className="
                    mt-4
                    line-clamp-2
                    text-base
                    font-semibold
                    leading-6
                    text-slate-900
                "
            >
                {task.title}
            </h3>

            {/* Meta */}

            <div className="mt-4 flex flex-wrap gap-2">
                {task.points !== undefined && task.points > 0 ? (
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {task.points} pts
                    </div>
                ) : (
                    <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-300">
                        No points
                    </div>
                )}

                {task.expirationDate ? (
                    <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${isExpired ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'}`}>
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(task.expirationDate).toLocaleDateString()}
                    </div>
                ) : (
                    <div className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-300">
                        <CalendarIcon className="h-4 w-4" />
                        No due date
                    </div>
                )}
            </div>

            {/* Footer */}

            <div className="mt-6 flex items-center justify-between">
                {assignee ? (
                    <div className="flex items-center gap-3">
                        <AssigneeAvatar name={assignee.name} color={assignee.color} />
                        <p className="text-sm font-medium text-slate-700">{assignee.name}</p>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400">Unassigned</span>
                )}

                <div className="translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                    {showDeleteConfirm ? (
                        <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-xs text-slate-500">Delete?</span>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="rounded-lg bg-red-500 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                            >
                                Yes
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowDeleteConfirm(false)
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowDeleteConfirm(true)
                                }}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium text-blue-500">→</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskCard
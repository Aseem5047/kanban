import { useMemo } from 'react'
import type { Task } from '../../types/data.types'
import { useTaskStore } from '../../stores/task.store'

import AssigneeAvatar from '../Common/Avatar'
import PriorityBadge from '../Common/PriorityBadge'

type Props = {
    task: Task
}

const TaskCard = ({ task }: Props) => {
    const openTask = useTaskStore((s) => s.openTask)

    const tags = useTaskStore((s) => s.tags)
    const assignees = useTaskStore((s) => s.assignees)

    const tag = useMemo(
        () => tags.find((t) => t.id === task.tagId),
        [tags, task.tagId]
    )

    const assignee = useMemo(
        () => assignees.find((a) => a.id === task.assigneeId),
        [assignees, task.assigneeId]
    )

    return (
        <div
            draggable
            onDragStart={(e) =>
                e.dataTransfer.setData('id', task.id)
            }
            onClick={() => openTask(task.id)}
            className="
                cursor-pointer
                rounded-xl
                border
                border-gray-200
                bg-white
                p-4
                shadow-sm
                hover:shadow-md
            "
        >
            <div className="flex justify-between">
                <PriorityBadge priority={task.priority} />
            </div>

            <h3 className="mt-3 font-medium wrap-break-words">
                {task.title}
            </h3>

            <div className="mt-4 flex items-center justify-between">
                {assignee ? (
                    <AssigneeAvatar name={assignee.name} />
                ) : (
                    <div />
                )}

                {tag && (
                    <span
                        className="rounded-full px-2 py-1 text-xs text-white"
                        style={{
                            backgroundColor: tag.color,
                        }}
                    >
                        {tag.name}
                    </span>
                )}
            </div>

            {task.expirationDate && (
                <div className="mt-3 text-xs text-gray-500">
                    {new Date(
                        task.expirationDate
                    ).toLocaleDateString()}
                </div>
            )}
        </div>
    )
}

export default TaskCard
import type { Priority, Task } from '../../types/task.types'
import { useTaskStore } from '../../stores/task.store'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import TaskField from './TaskField'
import EntitySelect from './EntitySelect'
import MoveTaskSelect from './MoveTaskSelect'

type Props = {
    draft: Task
    currentStatus: Task['status']
    onChange: (updated: Task) => void
    onMove: (status: Task['status']) => void
}

const TaskDrawerFields = ({
    draft,
    currentStatus,
    onChange,
    onMove,
}: Props) => {
    const assignees = useTaskStore((s) => s.assignees)
    const tags = useTaskStore((s) => s.tags)
    const addAssignee = useTaskStore((s) => s.addAssignee)
    const addTag = useTaskStore((s) => s.addTag)

    return (
        <div className="space-y-4">
            {/* TITLE */}
            <TaskField label="Title">
                <input
                    value={draft.title}
                    onChange={(e) =>
                        onChange({ ...draft, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
            </TaskField>

            {/* STATUS */}
            <TaskField label="Status">
                <MoveTaskSelect
                    currentStatus={currentStatus}
                    onMove={onMove}
                />
            </TaskField>

            {/* PRIORITY */}
            <TaskField label="Priority">
                <div className="relative">
                    <select
                        value={draft.priority}
                        onChange={(e) =>
                            onChange({
                                ...draft,
                                priority: e.target.value as Priority,
                            })
                        }
                        className="appearance-none w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
            </TaskField>

            {/* ASSIGNEE */}
            <EntitySelect
                label="Assignee"
                items={assignees}
                placeholder="Select or create assignee"
                onSelect={(assigneeId) =>
                    onChange({ ...draft, assigneeId })
                }
                onCreate={(name) => {
                    addAssignee(name, '#6366f1')
                    return (
                        useTaskStore.getState().assignees.at(-1)?.id ?? ''
                    )
                }}
            />

            {/* TAG */}
            <EntitySelect
                label="Tag"
                items={tags}
                placeholder="Select or create tag"
                onSelect={(tagId) =>
                    onChange({ ...draft, tagId })
                }
                onCreate={(name) => {
                    addTag(name, '#6366f1')
                    return (
                        useTaskStore.getState().tags.at(-1)?.id ?? ''
                    )
                }}
            />

            {/* DUE DATE + STORY POINTS side by side */}
            <div className="grid grid-cols-2 gap-3">
                <TaskField label="Due Date">
                    <input
                        type="date"
                        value={
                            draft.expirationDate
                                ? new Date(draft.expirationDate)
                                    .toISOString()
                                    .split('T')[0]
                                : ''
                        }
                        onChange={(e) =>
                            onChange({
                                ...draft,
                                expirationDate: e.target.value
                                    ? new Date(e.target.value)
                                    : null,
                            })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                </TaskField>

                <TaskField label="Story Points">
                    <input
                        type="number"
                        min={0}
                        value={draft.points ?? 0}
                        onChange={(e) =>
                            onChange({
                                ...draft,
                                points: Number(e.target.value),
                            })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                </TaskField>
            </div>
        </div>
    )
}

export default TaskDrawerFields
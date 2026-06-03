import { useState } from 'react'

import type { Task } from '../../types/data.types'
import { useTaskStore } from '../../stores/task.store'

import TaskField from './TaskField'

type Props = {
    task: Task
}

const AssigneeSelect = ({ task }: Props) => {
    const [value, setValue] = useState('')

    const assignees = useTaskStore(
        (s) => s.assignees
    )

    const updateTask = useTaskStore(
        (s) => s.updateTask
    )

    const addAssignee = useTaskStore(
        (s) => s.addAssignee
    )

    const handleSelect = () => {
        const trimmed = value.trim()

        if (!trimmed) return

        const existing = assignees.find(
            (a) =>
                a.name.toLowerCase() ===
                trimmed.toLowerCase()
        )

        if (existing) {
            updateTask({
                ...task,
                assigneeId: existing.id,
            })
        } else {
            addAssignee(trimmed)

            const created =
                useTaskStore
                    .getState()
                    .assignees.at(-1)

            if (created) {
                updateTask({
                    ...task,
                    assigneeId: created.id,
                })
            }
        }

        setValue('')
    }

    return (
        <TaskField label="Assignee">
            <input
                list="assignee-list"
                value={value}
                placeholder="Select or create assignee"
                onChange={(e) =>
                    setValue(e.target.value)
                }
                onBlur={handleSelect}
                className="w-full rounded border p-2"
            />

            <datalist id="assignee-list">
                {assignees.map((a) => (
                    <option
                        key={a.id}
                        value={a.name}
                    />
                ))}
            </datalist>
        </TaskField>
    )
}

export default AssigneeSelect
import { useState } from 'react'

import type { Task } from '../../types/data.types'
import { useTaskStore } from '../../stores/task.store'

import TaskField from './TaskField'

type Props = {
    task: Task
}

const TagSelect = ({ task }: Props) => {
    const [value, setValue] = useState('')

    const tags = useTaskStore(
        (s) => s.tags
    )

    const updateTask = useTaskStore(
        (s) => s.updateTask
    )

    const addTag = useTaskStore(
        (s) => s.addTag
    )

    const handleSelect = () => {
        const trimmed = value.trim()

        if (!trimmed) return

        const existing = tags.find(
            (tag) =>
                tag.name.toLowerCase() ===
                trimmed.toLowerCase()
        )

        if (existing) {
            updateTask({
                ...task,
                tagId: existing.id,
            })
        } else {
            addTag(trimmed, '#6366f1')

            const created =
                useTaskStore.getState().tags.at(-1)

            if (created) {
                updateTask({
                    ...task,
                    tagId: created.id,
                })
            }
        }

        setValue('')
    }

    return (
        <TaskField label="Tag">
            <input
                list="tag-list"
                value={value}
                placeholder="Select or create tag"
                onChange={(e) =>
                    setValue(e.target.value)
                }
                onBlur={handleSelect}
                className="w-full rounded border p-2"
            />

            <datalist id="tag-list">
                {tags.map((tag) => (
                    <option
                        key={tag.id}
                        value={tag.name}
                    />
                ))}
            </datalist>
        </TaskField>
    )
}

export default TagSelect
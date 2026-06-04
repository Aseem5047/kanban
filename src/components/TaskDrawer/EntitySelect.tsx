import { useEffect, useState } from 'react'

import TaskField from './TaskField'

type Entity = {
    id: string
    name: string
}

type EntitySelectProps = {
    label: string

    items: Entity[]

    selectedId?: string | null

    placeholder?: string

    onSelect: (id: string) => void

    onCreate: (
        name: string
    ) => string | Promise<string>
}

const EntitySelect = ({
    label,
    items,
    selectedId,
    placeholder = 'Select or create...',
    onSelect,
    onCreate,
}: EntitySelectProps) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        const selected = items.find(
            (item) => item.id === selectedId
        )

        setValue(selected?.name ?? '')
    }, [selectedId, items])

    const handleSubmit = async () => {
        const trimmed = value.trim()

        if (!trimmed) return

        const existing = items.find(
            (item) =>
                item.name.toLowerCase() ===
                trimmed.toLowerCase()
        )

        if (existing) {
            onSelect(existing.id)
            return
        }

        const createdId = await onCreate(
            trimmed
        )

        if (createdId) {
            onSelect(createdId)
        }
    }

    return (
        <TaskField label={label}>
            <input
                list={`${label}-list`}
                value={value}
                placeholder={placeholder}
                onChange={(e) =>
                    setValue(e.target.value)
                }
                onBlur={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit()
                    }

                    if (e.key === 'Escape') {
                        const selected =
                            items.find(
                                (item) =>
                                    item.id ===
                                    selectedId
                            )

                        setValue(
                            selected?.name ?? ''
                        )
                    }
                }}
                className="
                    w-full
                    rounded
                    border
                    border-gray-200
                    p-2
                    bg-slate-50        
                    outline-none
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-100
                "
            />

            <datalist id={`${label}-list`}>
                {items.map((item) => (
                    <option
                        key={item.id}
                        value={item.name}
                    />
                ))}
            </datalist>
        </TaskField>
    )
}

export default EntitySelect
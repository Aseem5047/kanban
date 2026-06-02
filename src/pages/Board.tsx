import { useState } from 'react'

import { useTasks } from '../hooks/useTasks'
import { buildColumns } from '../utils/task.utils'

import TaskColumn from '../components/TaskColumn/TaskColumn'
import type { Status } from '../types/data.types'

const Board = () => {
    const { tasks, updateTask } = useTasks()

    const [hoveredColumn, setHoveredColumn] =
        useState<Status | null>(null)

    const columns = buildColumns(tasks)

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        status: Status
    ) => {
        e.preventDefault()

        setHoveredColumn(null)

        const taskId = e.dataTransfer.getData('id')

        const task = tasks.find(
            (task) => task.id === taskId
        )

        if (!task) return

        updateTask({
            ...task,
            status
        })
    }

    return (
        <div className="flex divide-x">
            {columns.map((column) => (
                <TaskColumn
                    key={column.status}
                    status={column.status}
                    tasks={column.tasks}
                    isHovered={hoveredColumn === column.status}
                    onDrop={handleDrop}
                    onDragEnter={setHoveredColumn}
                    updateTask={updateTask}
                />
            ))}
        </div>
    )
}

export default Board
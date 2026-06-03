import { useEffect, useMemo, useState } from 'react'

import { useTaskStore } from '../stores/task.store'
import { buildColumns } from '../utils/task.utils'

import TaskColumn from '../components/TaskColumn/TaskColumn'
import type { Status } from '../types/data.types'
import TopBar from '../components/Topbar/Topbar'

const Board = () => {
    const tasks = useTaskStore((state) => state.tasks)
    const filters = useTaskStore((state) => state.filters)
    const fetchTasks = useTaskStore((state) => state.fetchTasks)
    const updateTask = useTaskStore((state) => state.updateTask)

    const isLoading = useTaskStore((state) => state.isLoading)
    const error = useTaskStore((state) => state.error)

    const [hoveredColumn, setHoveredColumn] =
        useState<Status | null>(null)

    /* -----------------------------
       Fetch tasks once
    ------------------------------ */
    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    /* -----------------------------
       Filtered tasks (optimized)
    ------------------------------ */
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase())

            const matchesPriority =
                filters.priorities.includes(task.priority)

            const matchesAssignee =
                !filters.assignee ||
                task.assigneeId === filters.assignee

            const matchesTag =
                !filters.tag ||
                task.tagId === filters.tag

            return (
                matchesSearch &&
                matchesPriority &&
                matchesAssignee &&
                matchesTag
            )
        })
    }, [tasks, filters])

    /* -----------------------------
       Columns
    ------------------------------ */
    const columns = useMemo(
        () => buildColumns(filteredTasks),
        [filteredTasks]
    )

    /* -----------------------------
       Drag & Drop
    ------------------------------ */
    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        status: Status
    ) => {
        e.preventDefault()
        setHoveredColumn(null)

        const taskId = e.dataTransfer.getData('id')

        const task = tasks.find((t) => t.id === taskId)
        if (!task) return

        if (task.status === status) return

        updateTask({
            ...task,
            status,
        })
    }

    /* -----------------------------
        LOADING STATE
    ------------------------------ */
    if (isLoading) {
        return (
            <div className="flex h-screen flex-col">
                <TopBar />
                <div className="flex flex-1 items-center justify-center">
                    <p>Loading tasks...</p>
                </div>
            </div>
        )
    }

    /* -----------------------------
       ERROR STATE
    ------------------------------ */
    if (error) {
        return (
            <div className="flex h-screen flex-col">
                <TopBar />
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center space-y-2">
                        <p className="text-red-500">
                            {error}
                        </p>

                        <button
                            onClick={fetchTasks}
                            className="text-blue-500 hover:underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    /* -----------------------------
       Main UI
    ------------------------------ */
    return (
        <div className="flex h-screen flex-col">
            <TopBar />

            <div className="flex h-screen gap-4 p-4">
                {columns.map((column) => (
                    <TaskColumn
                        key={column.status}
                        status={column.status}
                        tasks={column.tasks}
                        isHovered={
                            hoveredColumn === column.status
                        }
                        onDrop={handleDrop}
                        onDragEnter={setHoveredColumn}
                    />
                ))}
            </div>
        </div>
    )
}

export default Board
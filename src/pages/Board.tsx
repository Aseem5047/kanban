import { useEffect, useMemo, useState } from 'react'

import { useTaskStore } from '../stores/task.store'
import { buildColumns } from '../utils/task.utils'

import TaskColumn from '../components/TaskColumn/TaskColumn'
import { statusLabel, type Status } from '../types/task.types'
import TopBar from '../components/Topbar/Topbar'
import TaskDrawer from '../components/TaskDrawer/TaskDrawer'
import UndoToast from '../components/UndoToast/UndoToast'
import { useUndoStore } from '../stores/undo.store'
import LoadingState from '../components/Common/LoadingState'
import ErrorState from '../components/Common/ErrorState'

const Board = () => {
    const tasks = useTaskStore((state) => state.tasks)
    const filters = useTaskStore((state) => state.filters)

    const fetchTasks = useTaskStore(
        (state) => state.fetchTasks
    )

    const updateTask = useTaskStore(
        (state) => state.updateTask
    )

    const isFetching = useTaskStore((state) => state.isFetching)
    const fetchError = useTaskStore((state) => state.fetchError)

    const [hoveredColumn, setHoveredColumn] =
        useState<Status | null>(null)

    /* -----------------------------
       Fetch Tasks
    ------------------------------ */

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])


    /* -----------------------------
       Filter Tasks
    ------------------------------ */

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(
                        filters.search.toLowerCase()
                    )

            const matchesPriority =
                filters.priorities.includes(
                    task.priority
                )

            const matchesAssignee =
                !filters.assignee ||
                task.assigneeId ===
                filters.assignee

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
       Build Columns
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

        const taskId =
            e.dataTransfer.getData('id')

        const task = tasks.find(
            (t) => t.id === taskId
        )

        if (!task) return

        if (task.status === status) return

        const previousStatus =
            task.status

        updateTask({
            ...task,
            status,
        })

        useUndoStore
            .getState()
            .setAction({
                type: 'move',
                taskId: task.id,
                from: previousStatus,
                to: status,
                message: `Moved to ${statusLabel[status]}. Undo?`,
            })
    }

    /* -----------------------------
       Loading
    ------------------------------ */

    if (isFetching) {
        return (
            <div className="flex h-screen flex-col bg-slate-50">
                <TopBar />

                <div className="flex flex-1 items-center justify-center">
                    <LoadingState
                        title="Loading Board"
                        description="Fetching tasks and preparing your workspace..."
                    />
                </div>
            </div>
        )
    }

    /* -----------------------------
       Error
    ------------------------------ */

    if (fetchError) {
        return (
            <div className="flex h-screen flex-col bg-slate-50">
                <TopBar />

                <div className="flex flex-1 items-center justify-center">
                    <ErrorState
                        title="Unable to Load Tasks"
                        message={fetchError}
                        onRetry={fetchTasks}
                    />
                </div>
            </div>
        )
    }

    /* -----------------------------
       Main UI
    ------------------------------ */

    return (
        <div className="flex h-screen flex-col bg-slate-50">
            <TopBar />

            <main
                className="
                    flex-1
                    overflow-x-auto
                    overflow-y-hidden
                "
            >
                <div
                    className="
                        flex
                        h-full
                        min-w-max
                        items-start
                        gap-6
                        p-6
                    "
                >
                    {columns.map((column) => (
                        <TaskColumn
                            key={column.status}
                            status={column.status}
                            tasks={column.tasks}
                            isHovered={
                                hoveredColumn ===
                                column.status
                            }
                            onDrop={handleDrop}
                            onDragEnter={
                                setHoveredColumn
                            }
                        />
                    ))}
                </div>
            </main>

            <UndoToast />

            <TaskDrawer />
        </div>
    )
}

export default Board
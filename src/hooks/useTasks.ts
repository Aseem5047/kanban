import { useEffect, useState } from 'react'

import type {
    Task,
    Status,
    Priority,
} from '../types/data.types'

import {
    getTasks,
    getTaskById,
    getTasksByFilters,
    createTask,
    updateTaskById,
    patchTaskById,
    deleteTaskById,
} from '../services/task.services'

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadTasks = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const data = await getTasks()

            setTasks(data)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load tasks'
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    const getTask = async (id: string) => {
        return getTaskById(id)
    }

    const filterTasks = async (filters: {
        status?: Status
        priority?: Priority
        points?: number
    }) => {
        try {
            setIsLoading(true)

            const filteredTasks =
                await getTasksByFilters(filters)

            setTasks(filteredTasks)
        } finally {
            setIsLoading(false)
        }
    }

    const createNewTask = async (task: Task) => {
        const createdTask = await createTask(task)

        setTasks((prev) => [...prev, createdTask])

        return createdTask
    }

    const updateTask = async (task: Task) => {
        const existingTask = tasks.find(
            (t) => t.id === task.id
        )

        if (!existingTask) return

        // avoid unnecessary API calls
        if (JSON.stringify(existingTask) === JSON.stringify(task)) {
            return
        }

        const updatedTask = await updateTaskById(task)

        setTasks((prev) =>
            prev.map((t) =>
                t.id === updatedTask.id
                    ? updatedTask
                    : t
            )
        )

        return updatedTask
    }

    const patchTask = async (
        id: string,
        updates: Partial<Task>
    ) => {
        const updatedTask = await patchTaskById(
            id,
            updates
        )

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? updatedTask
                    : task
            )
        )

        return updatedTask
    }

    const deleteTask = async (id: string) => {
        await deleteTaskById(id)

        setTasks((prev) =>
            prev.filter((task) => task.id !== id)
        )
    }

    return {
        tasks,
        isLoading,
        error,

        loadTasks,
        getTask,
        filterTasks,

        createTask: createNewTask,
        updateTask,
        patchTask,
        deleteTask,
    }
}
import { useEffect, useState } from 'react'
import type { Task } from '../types/data.types'
import { getTasks, updateTaskById } from '../services/task.services'

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        const loadTasks = async () => {
            const data = await getTasks()
            setTasks(data)
        }

        loadTasks()
    }, [])

    const updateTask = async (task: Task) => {
        await updateTaskById(task)

        setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? task : t))
        )
    }

    return {
        tasks,
        updateTask
    }
}
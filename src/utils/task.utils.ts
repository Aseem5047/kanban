import { statuses, type Status, type Task } from "../types/data.types"

export const buildColumns = (tasks: Task[]) => {
    return statuses.map((status: Status) => ({
        status,
        tasks: tasks.filter((task) => task.status === status)
    }))
}
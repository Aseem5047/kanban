import {
    statuses,
    type Status,
    type Task,
} from '../types/data.types'

const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
} as const

const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
        const priorityDiff =
            priorityOrder[a.priority] -
            priorityOrder[b.priority]

        if (priorityDiff !== 0) {
            return priorityDiff
        }

        const aDate = a.expirationDate
            ? new Date(
                a.expirationDate
            ).getTime()
            : Number.MAX_SAFE_INTEGER

        const bDate = b.expirationDate
            ? new Date(
                b.expirationDate
            ).getTime()
            : Number.MAX_SAFE_INTEGER

        return aDate - bDate
    })
}

export const buildColumns = (
    tasks: Task[]
) => {
    return statuses.map(
        (status: Status) => ({
            status,

            tasks: sortTasks(
                tasks.filter(
                    (task) =>
                        task.status === status
                )
            ),
        })
    )
}
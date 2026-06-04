export type Status =
    | 'backlog'
    | 'in_progress'
    | 'done'

export type Priority =
    | 'low'
    | 'medium'
    | 'high'

export type Task = {
    id: string
    title: string
    status: Status
    priority: Priority

    assigneeId: string | null
    tagId: string | null

    expirationDate?: Date | null
    points?: number
}

export const statuses: Status[] = [
    'backlog',
    'in_progress',
    'done',
]

export const priorities: Priority[] = [
    'low',
    'medium',
    'high',
]

export type Assignee = {
    id: string
    name: string
    color: string
}

export type Tag = {
    id: string
    name: string
    color: string
}

export const statusLabel = {
    backlog: 'Backlog',
    inProgress: 'In Progress',
    done: 'Done',
} as const
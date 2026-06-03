export type Status =
    | 'todo'
    | 'in-progress'
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

    expirationDate: Date
    points?: number
}

export const statuses: Status[] = [
    'todo',
    'in-progress',
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
}

export type Tag = {
    id: string
    name: string
    color: string
}
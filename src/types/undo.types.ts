import type { Status, Task } from "./task.types"

export type UndoAction =
    | {
        type: 'move'
        taskId: string
        from: Status
        to: Status
        message: string
    }
    | {
        type: 'delete'
        task: Task
        message: string
    }
    | null
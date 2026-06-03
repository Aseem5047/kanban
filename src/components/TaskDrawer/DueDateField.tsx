import type { Task } from '../../types/data.types'
import { useTaskStore } from '../../stores/task.store'

import TaskField from './TaskField'

type Props = {
    task: Task
}

const DueDateField = ({ task }: Props) => {
    const updateTask = useTaskStore(
        (s) => s.updateTask
    )

    return (
        <TaskField label="Due Date">
            <input
                type="date"
                value={
                    task.expirationDate
                        ? new Date(
                            task.expirationDate
                        )
                            .toISOString()
                            .split('T')[0]
                        : ''
                }
                onChange={(e) =>
                    updateTask({
                        ...task,
                        expirationDate: e.target.value
                            ? new Date(
                                e.target.value
                            )
                            : null,
                    })
                }
                className="w-full rounded border p-2"
            />
        </TaskField>
    )
}

export default DueDateField
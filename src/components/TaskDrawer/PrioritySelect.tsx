import type { Task } from '../../types/data.types'
import { useTaskStore } from '../../stores/task.store'

import TaskField from './TaskField'

type Props = {
    task: Task
}

const PrioritySelect = ({ task }: Props) => {
    const updateTask = useTaskStore(
        (s) => s.updateTask
    )

    return (
        <TaskField label="Priority">
            <select
                value={task.priority}
                onChange={(e) =>
                    updateTask({
                        ...task,
                        priority:
                            e.target.value as Task['priority'],
                    })
                }
                className="w-full rounded border p-2"
            >
                <option value="low">Low</option>
                <option value="medium">
                    Medium
                </option>
                <option value="high">High</option>
            </select>
        </TaskField>
    )
}

export default PrioritySelect
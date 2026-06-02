import type { Status, Task } from '../../types/data.types'
import TaskCard from '../TaskCard/TaskCard'

type TaskColumnProps = {
    status: Status
    tasks: Task[]
    isHovered: boolean
    onDrop: (
        e: React.DragEvent<HTMLDivElement>,
        status: Status
    ) => void
    onDragEnter: (status: Status) => void
    updateTask: (task: Task) => void
}

const TaskColumn = ({
    status,
    tasks,
    isHovered,
    onDrop,
    onDragEnter,
    updateTask
}: TaskColumnProps) => {
    return (
        <div
            onDrop={(e) => onDrop(e, status)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => onDragEnter(status)}
        >
            <div className="flex justify-between text-3xl p-2 font-bold text-gray-500">
                <h2 className="capitalize">{status}</h2>

                {tasks.reduce(
                    (total, task) => total + (task.points || 0),
                    0
                )}
            </div>

            <div
                className={`h-full ${isHovered ? 'bg-gray-200' : ''
                    }`}
            >
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                    />
                ))}
            </div>
        </div>
    )
}

export default TaskColumn
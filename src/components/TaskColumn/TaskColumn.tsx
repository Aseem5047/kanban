import { PlusIcon } from '@heroicons/react/20/solid'
import { useTaskStore } from '../../stores/task.store'
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
}

const TaskColumn = ({
    status,
    tasks,
    isHovered,
    onDrop,
    onDragEnter,
}: TaskColumnProps) => {

    const createTask = useTaskStore(
        (state) => state.createTask
    )

    const handleAddTask = async () => {
        await createTask({
            id: crypto.randomUUID(),
            title: 'New Task',
            status,
            priority: 'medium',
            points: 0,
            assigneeId: null,
            tagId: null,
            expirationDate: null
        });
    }

    return (
        <div
            className="flex flex-col gap-4 flex-1 min-w-0"
            onDrop={(e) => onDrop(e, status)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => onDragEnter(status)}
        >
            <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-bold capitalize text-gray-500">
                    {status}
                </h2>

                <span className="text-3xl font-bold text-blue-400">
                    {tasks.length}
                </span>
            </div>

            <div
                className={`
                flex
                flex-1
                flex-col
                gap-4
                min-w-0
                rounded-lg
                transition-colors
                ${isHovered ? 'bg-gray-200 p-2' : ''}
            `}
            >
                {/* -----------------------------
                    TASKS OR EMPTY STATE
                ------------------------------ */}
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                ) : (
                    <div className="flex flex-1 items-center justify-center text-center p-6">
                        <p className="text-sm text-gray-500">
                            No tasks here. Click "Add Task" to get started.
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={handleAddTask}
                className="mt-auto self-end rounded-full bg-blue-500 p-2.5 text-white hover:bg-blue-400 cursor-pointer"

            >
                <PlusIcon className="size-6 text-white" />

            </button>
        </div>
    )
}

export default TaskColumn
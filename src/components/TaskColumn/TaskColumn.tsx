import { PlusIcon } from '@heroicons/react/20/solid'
import { useTaskStore } from '../../stores/task.store'
import type { Status, Task } from '../../types/task.types'
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

const statusColors = {
    backlog: {
        badge: 'bg-slate-500',
        light: 'bg-slate-50',
    },
    'in_progress': {
        badge: 'bg-amber-500',
        light: 'bg-amber-50',
    },
    done: {
        badge: 'bg-emerald-500',
        light: 'bg-emerald-50',
    },
} as const

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

    const isCreating = useTaskStore((state) => state.isCreating)


    const handleAddTask = async () => {

        await createTask({
            id: crypto.randomUUID(),
            title: 'New Task',
            status,
            priority: 'medium',
            points: 0,
            assigneeId: null,
            tagId: null,
            expirationDate: null,
        })
    }

    const colors =
        statusColors[
        status.toLowerCase() as keyof typeof statusColors
        ] ?? statusColors.backlog

    return (
        <div
            onDrop={(e) => onDrop(e, status)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => onDragEnter(status)}
            className={`
                flex
                min-w-[340px]
                h-full
                flex-1
                flex-col
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                ${isHovered
                    ? 'ring-2 ring-blue-200 shadow-lg'
                    : ''
                }
            `}
        >
            {/* Header */}

            <div
                className="
                    sticky
                    top-0
                    z-10
                    rounded-t-3xl
                    border-b
                    border-slate-100
                    bg-white/90
                    px-5
                    py-4
                    backdrop-blur
                "
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`
                                h-3
                                w-3
                                rounded-full
                                ${colors.badge}
                            `}
                        />

                        <h2
                            className="
                                text-lg
                                font-semibold
                                capitalize
                                text-slate-800
                            "
                        >
                            {status === "in_progress" ? "In Progress" : status}
                        </h2>
                    </div>

                    <span
                        className={`
                            rounded-full
                            px-3
                            py-1
                            text-sm
                            font-semibold
                            text-slate-700
                            ${colors.light}
                        `}
                    >
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Tasks Area */}

            <div
                className={`
                    flex
                    flex-1
                    flex-col
                    gap-4
                    p-4
                    transition-all
                    duration-200
                    overflow-y-auto
                    ${isHovered
                        ? 'bg-blue-50/50'
                        : ''
                    }
                `}
            >
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))
                ) : (
                    <div
                        className="
                            flex
                            flex-1
                            min-h-[200px]
                            items-center
                            justify-center
                            rounded-2xl
                            border-2
                            border-dashed
                            border-slate-200
                            bg-slate-50
                            p-6
                            text-center
                        "
                    >
                        <div>
                            <p
                                className="
                                    font-medium
                                    text-slate-500
                                "
                            >
                                No tasks yet
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-400
                                "
                            >
                                Drag tasks here or create a new
                                one
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}

            <div
                className="
                    border-t
                    border-slate-100
                    p-4
                "
            >
                <button
                    onClick={handleAddTask}
                    disabled={isCreating}
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition-all
                        hover:border-blue-300
                        hover:bg-blue-50
                        hover:text-blue-600
                        disabled:opacity-50 
                        disabled:cursor-not-allowed
                    "
                >
                    <PlusIcon className="h-5 w-5" />

                    {isCreating ? 'Adding...' : 'Add Task'}

                </button>
            </div>
        </div>
    )
}

export default TaskColumn
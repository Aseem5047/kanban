import {
    XMarkIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline'

type Props = {
    onClose: () => void
}

const TaskDrawerHeader = ({ onClose }: Props) => (
    <div className="flex items-start justify-between pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <PencilSquareIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900">
                    Task Details
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Edit and manage this task
                </p>
            </div>
        </div>

        <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
            <XMarkIcon className="h-5 w-5" />
        </button>
    </div>
)

export default TaskDrawerHeader
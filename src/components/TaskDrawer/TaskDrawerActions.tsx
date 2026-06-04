import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline'

type Props = {
    isDirty: boolean
    isUpdating: boolean
    isDeleting: boolean
    showDeleteConfirm: boolean
    taskTitle: string
    onSave: () => void
    onDeleteRequest: () => void
    onDeleteConfirm: () => void
    onDeleteCancel: () => void
}

const TaskDrawerActions = ({
    isDirty,
    isUpdating,
    isDeleting,
    showDeleteConfirm,
    taskTitle,
    onSave,
    onDeleteRequest,
    onDeleteConfirm,
    onDeleteCancel,
}: Props) => {
    if (showDeleteConfirm) {
        return (
            <div className="sticky bottom-0 bg-white pt-3 border-t border-slate-100">
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700 mb-1">
                        Delete this task?
                    </p>
                    <p className="text-xs text-red-400 mb-4 line-clamp-1">
                        "{taskTitle}" will be permanently removed.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={onDeleteConfirm}
                            disabled={isDeleting}
                            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, delete'}
                        </button>
                        <button
                            onClick={onDeleteCancel}
                            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="sticky bottom-0 bg-slate-50 p-2 border-t border-slate-100">
            <div className="flex gap-2">
                <button
                    disabled={!isDirty || isUpdating}
                    onClick={onSave}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <CheckIcon className="h-4 w-4" />
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                    onClick={onDeleteRequest}
                    disabled={isDeleting}
                    className="flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-500 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default TaskDrawerActions
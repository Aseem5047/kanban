import { ChevronDownIcon } from '@heroicons/react/20/solid'
import type { Status } from '../../types/task.types'

type Props = {
    currentStatus: Status
    onMove: (status: Status) => void
}

const statuses: Status[] = [
    'backlog',
    'in_progress',
    'done',
]

const MoveTaskSelect = ({
    currentStatus,
    onMove,
}: Props) => {
    const availableStatuses =
        statuses.filter(
            (status) =>
                status !== currentStatus
        )

    return (
        <div className="relative">

            <select
                defaultValue=""
                onChange={(e) =>
                    onMove(
                        e.target.value as Status
                    )
                }
                className="
                    appearance-none
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-100
                "
            >
                <option value="">
                    Move To...
                </option>

                {availableStatuses.map(
                    (status) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>
                    )
                )}
            </select>
            <ChevronDownIcon
                className="
                    pointer-events-none
                    absolute
                    right-1
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-500
                "
            />
        </div>
    )
}

export default MoveTaskSelect
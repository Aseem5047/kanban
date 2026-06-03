import type { Status } from '../../types/data.types'

type Props = {
    currentStatus: Status
    onMove: (status: Status) => void
}

const statuses: Status[] = [
    'todo',
    'in-progress',
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
        <select
            defaultValue=""
            onChange={(e) =>
                onMove(
                    e.target.value as Status
                )
            }
            className="
                w-full
                rounded
                border
                p-2
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
    )
}

export default MoveTaskSelect
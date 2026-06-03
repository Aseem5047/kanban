import {
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    EqualsIcon,
} from '@heroicons/react/20/solid'

import type { Task } from '../../types/data.types'

type Props = {
    priority: Task['priority']
}

const PriorityBadge = ({ priority }: Props) => {
    if (priority === 'high') {
        return (
            <div className="flex items-center gap-1 text-blue-500">
                <ChevronDoubleUpIcon className="h-5 w-5" />
                <span className="text-xs font-medium">
                    High
                </span>
            </div>
        )
    }

    if (priority === 'medium') {
        return (
            <div className="flex items-center gap-1 text-yellow-500">
                <EqualsIcon className="h-5 w-5" />
                <span className="text-xs font-medium">
                    Medium
                </span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1 text-red-500">
            <ChevronDoubleDownIcon className="h-5 w-5" />
            <span className="text-xs font-medium">
                Low
            </span>
        </div>
    )
}

export default PriorityBadge
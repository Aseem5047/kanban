import type { ReactNode } from "react"

type Props = {
    label: string
    children: ReactNode
}

const TaskField = ({
    label,
    children,
}: Props) => {
    return (
        <div className="space-y-1">
            <label className="text-sm text-gray-500">
                {label}
            </label>

            {children}
        </div>
    )
}

export default TaskField
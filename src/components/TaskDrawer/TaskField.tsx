import type { ReactNode } from 'react'

type Props = {
    label: string
    children: ReactNode
}

const TaskField = ({
    label,
    children,
}: Props) => {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >
            <label
                className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </label>

            {children}
        </div>
    )
}

export default TaskField
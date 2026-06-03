import type { ReactNode } from "react"

type Props = {
    open: boolean
    onClose: () => void
    children: ReactNode
}

const Drawer = ({
    open,
    onClose,
    children,
}: Props) => {
    if (!open) return null

    return (
        <>
            <div
                onClick={onClose}
                className="
                    fixed inset-0
                    bg-black/30
                    z-40
                "
            />

            <div
                className="
                    fixed
                    right-0
                    top-0
                    h-screen
                    w-[420px]
                    bg-white
                    shadow-xl
                    z-50
                    overflow-y-auto
                    p-6
                "
            >
                {children}
            </div>
        </>
    )
}

export default Drawer
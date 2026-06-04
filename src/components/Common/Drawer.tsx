import type { ReactNode } from 'react'

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
                    fixed
                    inset-0
                    z-40
                    bg-slate-900/30
                    backdrop-blur-sm
                "
            />

            <div
                className="
                    fixed
                    right-0
                    top-0
                    z-50
                    h-screen
                    w-full
                    max-w-md
                    overflow-y-auto
                    bg-slate-50
                    shadow-2xl
                    rounded-l-lg
                "
            >
                <div className="p-6">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Drawer
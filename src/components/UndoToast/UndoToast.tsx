import { useEffect, useState } from 'react'
import {
    ArrowUturnLeftIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

import { useUndoStore } from '../../stores/undo.store'

const TOAST_DURATION = 5000

const UndoToast = () => {
    const action = useUndoStore(
        (s) => s.action
    )

    const undo = useUndoStore(
        (s) => s.undo
    )

    const clearAction = useUndoStore(
        (s) => s.clearAction
    )

    const [progress, setProgress] =
        useState(100)

    useEffect(() => {
        if (!action) return

        setProgress(100)

        const startTime =
            Date.now()

        const interval =
            setInterval(() => {
                const elapsed =
                    Date.now() - startTime

                const remaining =
                    Math.max(
                        0, 100 - (elapsed / TOAST_DURATION) * 100
                    )

                setProgress(remaining)
            }, 50)

        const timeout =
            setTimeout(() => {
                clearAction()
            }, TOAST_DURATION)

        return () => {
            clearInterval(
                interval
            )
            clearTimeout(
                timeout
            )
        }
    }, [action, clearAction])

    if (!action) {
        return null
    }

    return (
        <div
            className="
                fixed
                bottom-6
                right-6
                z-999
                w-[380px]
                overflow-hidden
                rounded-2xl
                border
                border-slate-700
                bg-slate-900
                text-white
                shadow-2xl
                animate-in
                slide-in-from-bottom-3
                fade-in
                duration-300
            "
        >
            {/* CONTENT */}

            <div className="p-4">
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >
                    <div className="min-w-0 flex-1">
                        <p
                            className="
                                text-sm
                                font-medium
                                text-white
                            "
                        >
                            {
                                action.message
                            }
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-400
                            "
                        >
                            This action can
                            be undone for 5
                            seconds.
                        </p>
                    </div>

                    <button
                        onClick={
                            clearAction
                        }
                        className="
                            rounded-lg
                            p-1
                            text-slate-400
                            transition
                            hover:bg-slate-800
                            hover:text-white
                        "
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* ACTIONS */}

                <div className="mt-4">
                    <button
                        onClick={
                            undo
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-500
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-600
                        "
                    >
                        <ArrowUturnLeftIcon className="h-4 w-4" />
                        Undo
                    </button>
                </div>
            </div>

            {/* PROGRESS BAR */}

            <div
                className="
                    h-1
                    w-full
                    bg-slate-800
                "
            >
                <div
                    className="
                        h-full
                        bg-blue-500
                        transition-[width]
                        duration-75
                        ease-linear
                    "
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
        </div>
    )
}

export default UndoToast
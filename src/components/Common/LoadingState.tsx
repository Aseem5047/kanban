import { ArrowPathIcon } from '@heroicons/react/24/outline'

type LoadingStateProps = {
    title?: string
    description?: string
}

const LoadingState = ({
    title = 'Loading...',
    description = 'Please wait while we fetch your data.',
}: LoadingStateProps) => {
    return (
        <div className="w-full flex items-center justify-center p-6">
            <div
                className="
                    flex
                    w-full
                    max-w-sm
                    flex-col
                    items-center
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-10
                    shadow-sm
                "
            >
                <div
                    className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-50
                    "
                >
                    <ArrowPathIcon
                        className="
                            h-8
                            w-8
                            animate-spin
                            text-blue-600
                        "
                    />
                </div>

                <h2
                    className="
                        mt-5
                        text-lg
                        font-semibold
                        text-slate-900
                    "
                >
                    {title}
                </h2>

                <p
                    className="
                        mt-2
                        text-center
                        text-sm
                        text-slate-500
                    "
                >
                    {description}
                </p>

                <div
                    className="
                        mt-6
                        h-1.5
                        w-full
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                    "
                >
                    <div
                        className="
                            h-full
                            w-1/3
                            animate-pulse
                            rounded-full
                            bg-blue-500
                        "
                    />
                </div>
            </div>
        </div>
    )
}

export default LoadingState
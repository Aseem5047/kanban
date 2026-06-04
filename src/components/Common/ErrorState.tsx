import {
    ArrowPathIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

type ErrorStateProps = {
    title?: string
    message: string
    actionLabel?: string
    onRetry?: () => void
}

const ErrorState = ({
    title = 'Something went wrong',
    message,
    actionLabel = 'Try Again',
    onRetry,
}: ErrorStateProps) => {
    return (
        <div className="w-full flex items-center justify-center p-6">
            <div
                className="
                    flex
                    w-full
                    max-w-md
                    flex-col
                    items-center
                    rounded-3xl
                    border
                    border-red-100
                    bg-white
                    p-10
                    text-center
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
                        bg-red-50
                    "
                >
                    <ExclamationTriangleIcon
                        className="
                            h-8
                            w-8
                            text-red-500
                        "
                    />
                </div>

                <h2
                    className="
                        mt-5
                        text-xl
                        font-semibold
                        text-slate-900
                    "
                >
                    {title}
                </h2>

                <p
                    className="
                        mt-3
                        max-w-sm
                        text-sm
                        leading-relaxed
                        text-slate-500
                    "
                >
                    {message}
                </p>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="
                            mt-8
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            font-medium
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-blue-700
                            hover:shadow-md
                        "
                    >
                        <ArrowPathIcon className="h-5 w-5" />
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    )
}

export default ErrorState
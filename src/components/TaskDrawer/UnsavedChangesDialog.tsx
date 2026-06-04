type Props = {
    open: boolean
    onDiscard: () => void
    onCancel: () => void
}

const UnsavedChangesDialog = ({
    open,
    onDiscard,
    onCancel,
}: Props) => {
    if (!open) return null

    return (
        <>
            <div
                className="
                    fixed
                    inset-0
                    bg-black/40
                    z-60
                "
            />

            <div
                className="
                    fixed
                    top-1/2
                    left-1/2
                    z-61
                    w-[400px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-lg
                    bg-white
                    p-6
                "
            >
                <h3 className="font-semibold">
                    Unsaved Changes
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                    You have unsaved changes.
                    Discard them?
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            px-4
                            py-2
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDiscard}
                        className="
                            rounded-xl
                            bg-red-500
                            px-4
                            py-2
                            text-white
                        "
                    >
                        Discard
                    </button>
                </div>
            </div>
        </>
    )
}

export default UnsavedChangesDialog
import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import Drawer from '../Common/Drawer'

import TaskField from './TaskField'
import EntitySelect from './EntitySelect'
import MoveTaskSelect from './MoveTaskSelect'
import UnsavedChangesDialog from './UnsavedChangesDialog'

import { useTaskStore } from '../../stores/task.store'

import type {
    Priority,
    Task,
} from '../../types/data.types'

const TaskDrawer = () => {
    const selectedTaskId = useTaskStore(
        (s) => s.selectedTaskId
    )

    const closeTask = useTaskStore(
        (s) => s.closeTask
    )

    const updateTask = useTaskStore(
        (s) => s.updateTask
    )

    const deleteTask = useTaskStore(
        (s) => s.deleteTask
    )

    const assignees = useTaskStore(
        (s) => s.assignees
    )

    const tags = useTaskStore(
        (s) => s.tags
    )

    const addAssignee = useTaskStore(
        (s) => s.addAssignee
    )

    const addTag = useTaskStore(
        (s) => s.addTag
    )

    const task = useTaskStore((s) =>
        s.tasks.find(
            (t) => t.id === selectedTaskId
        )
    )

    const [draft, setDraft] =
        useState<Task | null>(null)

    const [
        showDiscardDialog,
        setShowDiscardDialog,
    ] = useState(false)

    useEffect(() => {
        if (task) {
            setDraft(task)
        }
    }, [task])

    const isDirty = useMemo(() => {
        if (!task || !draft)
            return false

        return (
            JSON.stringify(task) !==
            JSON.stringify(draft)
        )
    }, [task, draft])

    useEffect(() => {
        const handleEscape = (
            e: KeyboardEvent
        ) => {
            if (e.key !== 'Escape')
                return

            if (isDirty) {
                setShowDiscardDialog(true)
                return
            }

            closeTask()
        }

        window.addEventListener(
            'keydown',
            handleEscape
        )

        return () =>
            window.removeEventListener(
                'keydown',
                handleEscape
            )
    }, [isDirty, closeTask])

    if (!task || !draft) {
        return null
    }

    const handleClose = () => {
        if (isDirty) {
            setShowDiscardDialog(true)
            return
        }

        closeTask()
    }

    const handleSave = async () => {
        await updateTask(draft)

        closeTask()
    }

    const handleMoveTask = async (
        status: Task['status']
    ) => {
        await updateTask({
            ...task,
            status,
        })

        setDraft((prev) =>
            prev
                ? {
                    ...prev,
                    status,
                }
                : prev
        )
    }

    return (
        <>
            <Drawer
                open={!!task}
                onClose={handleClose}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            Task Details
                        </h2>

                        <button
                            onClick={handleClose}
                            className="
                                rounded
                                border
                                px-3
                                py-1
                                text-sm
                            "
                        >
                            Close
                        </button>
                    </div>

                    {/* TITLE */}

                    <TaskField label="Title">
                        <input
                            value={draft.title}
                            onChange={(e) =>
                                setDraft({
                                    ...draft,
                                    title:
                                        e.target
                                            .value,
                                })
                            }
                            className="
                                w-full
                                rounded
                                border
                                p-2
                            "
                        />
                    </TaskField>

                    {/* MOVE TASK */}

                    <TaskField label="Move Task">
                        <MoveTaskSelect
                            currentStatus={
                                task.status
                            }
                            onMove={
                                handleMoveTask
                            }
                        />
                    </TaskField>

                    {/* PRIORITY */}

                    <TaskField label="Priority">
                        <select
                            value={
                                draft.priority
                            }
                            onChange={(e) =>
                                setDraft({
                                    ...draft,
                                    priority:
                                        e.target
                                            .value as Priority,
                                })
                            }
                            className="
                                w-full
                                rounded
                                border
                                p-2
                            "
                        >
                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>
                        </select>
                    </TaskField>

                    {/* ASSIGNEE */}

                    <EntitySelect
                        label="Assignee"
                        items={assignees}
                        placeholder="Select or create assignee"
                        onSelect={(
                            assigneeId
                        ) =>
                            setDraft({
                                ...draft,
                                assigneeId,
                            })
                        }
                        onCreate={(
                            name
                        ) => {
                            addAssignee(
                                name
                            )

                            return (
                                useTaskStore
                                    .getState()
                                    .assignees.at(
                                        -1
                                    )?.id ??
                                ''
                            )
                        }}
                    />

                    {/* TAG */}

                    <EntitySelect
                        label="Tag"
                        items={tags}
                        placeholder="Select or create tag"
                        onSelect={(tagId) =>
                            setDraft({
                                ...draft,
                                tagId,
                            })
                        }
                        onCreate={(
                            name
                        ) => {
                            addTag(
                                name,
                                '#6366f1'
                            )

                            return (
                                useTaskStore
                                    .getState()
                                    .tags.at(
                                        -1
                                    )?.id ??
                                ''
                            )
                        }}
                    />

                    {/* DUE DATE */}

                    <TaskField label="Due Date">
                        <input
                            type="date"
                            value={
                                draft.expirationDate
                                    ? new Date(
                                        draft.expirationDate
                                    )
                                        .toISOString()
                                        .split(
                                            'T'
                                        )[0]
                                    : ''
                            }
                            onChange={(
                                e
                            ) =>
                                setDraft({
                                    ...draft,
                                    expirationDate:
                                        e
                                            .target
                                            .value
                                            ? new Date(
                                                e
                                                    .target
                                                    .value
                                            )
                                            : null,
                                })
                            }
                            className="
                                w-full
                                rounded
                                border
                                p-2
                            "
                        />
                    </TaskField>

                    {/* STORY POINTS */}

                    <TaskField label="Story Points">
                        <input
                            type="number"
                            value={
                                draft.points ??
                                0
                            }
                            onChange={(e) =>
                                setDraft({
                                    ...draft,
                                    points:
                                        Number(
                                            e
                                                .target
                                                .value
                                        ),
                                })
                            }
                            className="
                                w-full
                                rounded
                                border
                                p-2
                            "
                        />
                    </TaskField>

                    {/* ACTIONS */}

                    <div className="flex gap-3">
                        <button
                            disabled={
                                !isDirty
                            }
                            onClick={
                                handleSave
                            }
                            className="
                                flex-1
                                rounded
                                bg-blue-500
                                py-2
                                text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Save Changes
                        </button>

                        <button
                            onClick={async () => {
                                await deleteTask(
                                    task.id
                                )

                                closeTask()
                            }}
                            className="
                                rounded
                                bg-red-500
                                px-4
                                py-2
                                text-white
                            "
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Drawer>

            <UnsavedChangesDialog
                open={
                    showDiscardDialog
                }
                onCancel={() =>
                    setShowDiscardDialog(
                        false
                    )
                }
                onDiscard={() => {
                    setShowDiscardDialog(
                        false
                    )

                    setDraft(task)

                    closeTask()
                }}
            />
        </>
    )
}

export default TaskDrawer
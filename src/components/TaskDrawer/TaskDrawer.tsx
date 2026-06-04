import { useEffect, useMemo, useState } from 'react'

import Drawer from '../Common/Drawer'
import UnsavedChangesDialog from './UnsavedChangesDialog'
import TaskDrawerHeader from './TaskDrawerHeader'
import TaskDrawerFields from './TaskDrawerFields'
import TaskDrawerActions from './TaskDrawerActions'

import { useTaskStore } from '../../stores/task.store'
import { useUndoStore } from '../../stores/undo.store'

import { statusLabel, type Task } from '../../types/task.types'

const TaskDrawer = () => {
    const [draft, setDraft] = useState<Task | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showDiscardDialog, setShowDiscardDialog] = useState(false)

    const selectedTaskId = useTaskStore((s) => s.selectedTaskId)
    const closeTask = useTaskStore((s) => s.closeTask)
    const updateTask = useTaskStore((s) => s.updateTask)
    const deleteTask = useTaskStore((s) => s.deleteTask)
    const isUpdating = useTaskStore((s) => s.isUpdating)
    const isDeleting = useTaskStore((s) => s.isDeleting)

    const task = useTaskStore((s) =>
        s.tasks.find((t) => t.id === selectedTaskId)
    )

    useEffect(() => {
        if (task) setDraft(task)
    }, [task])

    const isDirty = useMemo(() => {
        if (!task || !draft) return false
        return JSON.stringify(task) !== JSON.stringify(draft)
    }, [task, draft])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            if (isDirty) {
                setShowDiscardDialog(true)
                return
            }
            closeTask()
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isDirty, closeTask])

    if (!task || !draft) return null

    const handleClose = () => {
        setShowDeleteConfirm(false)
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

    const handleMoveTask = async (status: Task['status']) => {
        const previousStatus = task.status

        await updateTask({ ...task, status })

        useUndoStore.getState().setAction({
            type: 'move',
            taskId: task.id,
            from: previousStatus,
            to: status,
            message: `Moved to ${statusLabel[status]}. Undo?`,
        })

        setDraft((prev) => prev ? { ...prev, status } : prev)
    }

    const handleDeleteConfirm = async () => {
        useUndoStore.getState().setAction({
            type: 'delete',
            task,
            message: 'Task deleted. Undo?',
        })
        await deleteTask(task.id)
        closeTask()
    }

    return (
        <>
            <Drawer open={!!task} onClose={handleClose}>
                <div className="flex h-full flex-col gap-5">
                    <TaskDrawerHeader onClose={handleClose} />

                    <div className="flex-1 overflow-y-auto">
                        <TaskDrawerFields
                            draft={draft}
                            currentStatus={task.status}
                            onChange={setDraft}
                            onMove={handleMoveTask}
                        />
                    </div>

                    <TaskDrawerActions
                        isDirty={isDirty}
                        isUpdating={isUpdating}
                        isDeleting={isDeleting}
                        showDeleteConfirm={showDeleteConfirm}
                        taskTitle={task.title}
                        onSave={handleSave}
                        onDeleteRequest={() => setShowDeleteConfirm(true)}
                        onDeleteConfirm={handleDeleteConfirm}
                        onDeleteCancel={() => setShowDeleteConfirm(false)}
                    />
                </div>
            </Drawer>

            <UnsavedChangesDialog
                open={showDiscardDialog}
                onCancel={() => setShowDiscardDialog(false)}
                onDiscard={() => {
                    setShowDiscardDialog(false)
                    setShowDeleteConfirm(false)
                    setDraft(task)
                    closeTask()
                }}
            />
        </>
    )
}

export default TaskDrawer
import { create } from 'zustand'

import { useTaskStore } from './task.store'
import type { UndoAction } from '../types/undo.types'


/* -------------------------
   Types
-------------------------- */

type UndoStore = {
    action: UndoAction

    setAction: (
        action: UndoAction
    ) => void

    clearAction: () => void

    undo: () => Promise<void>
}

/* -------------------------
   Store
-------------------------- */

export const useUndoStore =
    create<UndoStore>((set, get) => ({
        action: null,

        setAction: (action) =>
            set({
                action,
            }),

        clearAction: () =>
            set({
                action: null,
            }),

        undo: async () => {
            const action =
                get().action

            if (!action) return

            switch (action.type) {
                case 'move': {
                    const {
                        tasks,
                        updateTask,
                    } =
                        useTaskStore.getState()

                    const task =
                        tasks.find(
                            (t) =>
                                t.id ===
                                action.taskId
                        )

                    if (!task) {
                        set({
                            action: null,
                        })
                        return
                    }

                    await updateTask({
                        ...task,
                        status:
                            action.from,
                    })

                    break
                }
                case 'delete': {
                    const { restoreTask } =
                        useTaskStore.getState()

                    await restoreTask(
                        action.task
                    )

                    break
                }
            }

            set({
                action: null,
            })
        },
    }))
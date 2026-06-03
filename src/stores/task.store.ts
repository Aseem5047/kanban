import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
    Task,
    Priority,
    Assignee,
    Tag,
} from '../types/data.types'

import {
    getTasks,
    createTask as createTaskService,
    updateTaskById,
    deleteTaskById,
} from '../services/task.services'

/* -------------------------
   Types
-------------------------- */

type Filters = {
    search: string
    priorities: Priority[]
    assignee: string | null
    tag: string | null
}

type TaskStore = {
    tasks: Task[]
    isLoading: boolean
    error: string | null

    assignees: Assignee[]
    tags: Tag[]

    addAssignee: (name: string) => void
    addTag: (name: string, color: string) => void

    filters: Filters

    fetchTasks: () => Promise<void>
    createTask: (task: Task) => Promise<void>
    updateTask: (task: Task) => Promise<void>
    deleteTask: (id: string) => Promise<void>

    setSearch: (search: string) => void
    togglePriority: (priority: Priority) => void
    setAssignee: (assigneeId: string | null) => void
    setTag: (tagId: string | null) => void
    clearFilters: () => void
}

/* -------------------------
   Defaults
-------------------------- */

const defaultFilters: Filters = {
    search: '',
    priorities: ['low', 'medium', 'high'],
    assignee: null,
    tag: null,
}

const defaultAssignees: Assignee[] = [
    { id: 'a1', name: 'John Doe' },
    { id: 'a2', name: 'Jane Smith' },
]

const defaultTags: Tag[] = [
    { id: 't1', name: 'Frontend', color: '#3b82f6' },
    { id: 't2', name: 'Backend', color: '#22c55e' },
]

/* -------------------------
   Store
-------------------------- */

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            tasks: [],
            isLoading: false,
            error: null,

            assignees: defaultAssignees,
            tags: defaultTags,

            filters: defaultFilters,

            /* -------------------------
               ASSIGNEES
            -------------------------- */

            addAssignee: (name) => {
                const newAssignee: Assignee = {
                    id: crypto.randomUUID(),
                    name,
                }

                set((state) => ({
                    assignees: [...state.assignees, newAssignee],
                }))
            },

            /* -------------------------
               TAGS
            -------------------------- */

            addTag: (name, color) => {
                const newTag: Tag = {
                    id: crypto.randomUUID(),
                    name,
                    color,
                }

                set((state) => ({
                    tags: [...state.tags, newTag],
                }))
            },

            /* -------------------------
               TASKS
            -------------------------- */

            fetchTasks: async () => {
                if (get().tasks.length) return

                try {
                    set({ isLoading: true, error: null })

                    const tasks = await getTasks()

                    set({
                        tasks,
                        isLoading: false,
                    })
                } catch (error) {
                    set({
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Failed to load tasks',
                        isLoading: false,
                    })
                }
            },

            createTask: async (task) => {
                const created = await createTaskService(task)

                set((state) => ({
                    tasks: [...state.tasks, created],
                }))
            },

            updateTask: async (task) => {
                const existing = get().tasks.find(
                    (t) => t.id === task.id
                )

                if (!existing) return

                if (
                    JSON.stringify(existing) ===
                    JSON.stringify(task)
                ) return

                await updateTaskById(task)

                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === task.id ? task : t
                    ),
                }))
            },

            deleteTask: async (id) => {
                await deleteTaskById(id)

                set((state) => ({
                    tasks: state.tasks.filter(
                        (t) => t.id !== id
                    ),
                }))
            },

            /* -------------------------
               FILTERS
            -------------------------- */

            setSearch: (search) =>
                set((state) => ({
                    filters: { ...state.filters, search },
                })),

            togglePriority: (priority) =>
                set((state) => {
                    const exists =
                        state.filters.priorities.includes(priority)

                    return {
                        filters: {
                            ...state.filters,
                            priorities: exists
                                ? state.filters.priorities.filter(
                                    (p) => p !== priority
                                )
                                : [...state.filters.priorities, priority],
                        },
                    }
                }),

            setAssignee: (assigneeId) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        assignee: assigneeId,
                    },
                })),

            setTag: (tagId) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        tag: tagId,
                    },
                })),

            clearFilters: () =>
                set({ filters: defaultFilters }),
        }),
        {
            name: 'task-store',
        }
    )
)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
    Task,
    Priority,
    Assignee,
    Tag,
} from '../types/task.types'

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
    isFetching: boolean
    fetchError: string | null
    isCreating: boolean
    isUpdating: boolean
    isDeleting: boolean

    assignees: Assignee[]
    tags: Tag[]

    selectedTaskId: string | null

    openTask: (id: string) => void
    closeTask: () => void

    addAssignee: (name: string, color: string) => void
    addTag: (name: string, color: string) => void

    filters: Filters

    fetchTasks: () => Promise<void>
    createTask: (task: Task) => Promise<void>
    updateTask: (task: Task) => Promise<void>
    deleteTask: (id: string) => Promise<void>
    restoreTask: (task: Task) => Promise<void>

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
    { id: 'a1', name: 'John Doe', color: '#3b82f6' },
    { id: 'a2', name: 'Jane Smith', color: '#22c55e' },
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
            isFetching: false,
            fetchError: null,
            isCreating: false,
            isUpdating: false,
            isDeleting: false,


            assignees: defaultAssignees,
            tags: defaultTags,

            selectedTaskId: null,

            filters: defaultFilters,

            /* -------------------------
               ASSIGNEES
            -------------------------- */

            addAssignee: (name, color) => {
                const newAssignee: Assignee = {
                    id: crypto.randomUUID(),
                    name,
                    color
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
                try {
                    set({ isFetching: true, fetchError: null })
                    const tasks = await getTasks()
                    set({ tasks, isFetching: false })
                } catch (error) {
                    set({
                        fetchError: error instanceof Error ? error.message : 'Failed to load tasks',
                        isFetching: false,
                    })
                }
            },

            createTask: async (task) => {
                set({ isCreating: true })
                const created = await createTaskService(task)
                set((state) => ({ tasks: [...state.tasks, created], isCreating: false }))
            },

            updateTask: async (task) => {
                const existing = get().tasks.find((t) => t.id === task.id)
                if (!existing) return
                if (JSON.stringify(existing) === JSON.stringify(task)) return
                set({ isUpdating: true })
                await updateTaskById(task)
                set((state) => ({
                    tasks: state.tasks.map((t) => t.id === task.id ? task : t),
                    isUpdating: false,
                }))
            },

            deleteTask: async (id) => {
                set({ isDeleting: true })
                await deleteTaskById(id)
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== id),
                    isDeleting: false,
                    selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
                }))
            },

            restoreTask: async (
                task: Task
            ) => {
                await createTaskService(task)

                set((state) => ({
                    tasks: [
                        ...state.tasks,
                        task,
                    ],
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

            /* -------------------------
                TASK DRAWER
            -------------------------- */

            openTask: (id) => {
                set({
                    selectedTaskId: id,
                })
            },

            closeTask: () => {
                set({
                    selectedTaskId: null,
                })
            },
        }),
        {
            name: 'task-store',
            partialize: (state) => ({
                assignees: state.assignees,
                tags: state.tags,
                filters: state.filters,
            }),
        }
    )
)
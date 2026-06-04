import { useEffect, useState } from 'react'

import {
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

import { useTaskStore } from '../../stores/task.store'

import type { Priority } from '../../types/task.types'

import { useDebounce } from '../../hooks/useDebounce'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const priorities: Priority[] = [
    'low',
    'medium',
    'high',
]

const priorityStyles = {
    low: {
        active:
            'border-emerald-200 bg-emerald-50 text-emerald-700',
        inactive:
            'border-transparent bg-transparent text-slate-500 hover:bg-slate-100',
    },
    medium: {
        active:
            'border-amber-200 bg-amber-50 text-amber-700',
        inactive:
            'border-transparent bg-transparent text-slate-500 hover:bg-slate-100',
    },
    high: {
        active:
            'border-rose-200 bg-rose-50 text-rose-700',
        inactive:
            'border-transparent bg-transparent text-slate-500 hover:bg-slate-100',
    },
}

const TopBar = () => {
    const filters = useTaskStore(
        (state) => state.filters
    )

    const assignees = useTaskStore(
        (state) => state.assignees
    )

    const tags = useTaskStore(
        (state) => state.tags
    )

    const setSearch = useTaskStore(
        (state) => state.setSearch
    )

    const togglePriority = useTaskStore(
        (state) => state.togglePriority
    )

    const setAssignee = useTaskStore(
        (state) => state.setAssignee
    )

    const setTag = useTaskStore(
        (state) => state.setTag
    )

    const clearFilters = useTaskStore(
        (state) => state.clearFilters
    )

    const [searchInput, setSearchInput] =
        useState(filters.search)

    const debouncedSearch = useDebounce(
        searchInput,
        300
    )

    useEffect(() => {
        setSearch(debouncedSearch)
    }, [debouncedSearch, setSearch])

    const activeFilterCount =
        (filters.search ? 1 : 0) +
        (filters.assignee ? 1 : 0) +
        (filters.tag ? 1 : 0) +
        (filters.priorities.length !== 3
            ? 1
            : 0)

    return (
        <div
            className="border-b border-slate-200 bg-white px-6 py-5"
        >
            <div className="mx-auto max-w-[1600px] space-y-4">
                {/* SEARCH */}

                <div className="relative">
                    <MagnifyingGlassIcon
                        className=" absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2  text-slate-400"
                    />

                    <input
                        type="text"
                        value={searchInput}
                        placeholder="Search tasks, assignees, tags..."
                        onChange={(e) =>
                            setSearchInput(
                                e.target.value
                            )
                        }
                        className=" h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                {/* FILTER BAR */}

                <div
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                >
                    {/* Label */}

                    <div
                        className="flex items-center gap-2 px-2 text-sm font-semibold text-slate-600"
                    >
                        <FunnelIcon className="h-4 w-4" />
                        Filters
                    </div>

                    <div className="h-6 w-px bg-slate-200" />

                    {/* Priority Chips */}

                    <div className="flex flex-wrap gap-2">
                        {priorities.map(
                            (priority) => {
                                const active =
                                    filters.priorities.includes(
                                        priority
                                    )

                                return (
                                    <button
                                        key={
                                            priority
                                        }
                                        onClick={() =>
                                            togglePriority(
                                                priority
                                            )
                                        }
                                        className={`
                                            rounded-xl
                                            border
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            capitalize
                                            transition-all
                                            duration-200
                                            hover:scale-95
                                            ${active
                                                ? priorityStyles[
                                                    priority
                                                ]
                                                    .active
                                                : priorityStyles[
                                                    priority
                                                ]
                                                    .inactive
                                            }
                                        `}
                                    >
                                        {priority}
                                    </button>
                                )
                            }
                        )}
                    </div>

                    {/* Assignee */}
                    <div className="relative">

                        <select
                            value={
                                filters.assignee ??
                                ''
                            }
                            onChange={(e) =>
                                setAssignee(
                                    e.target.value ||
                                    null
                                )
                            }
                            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-8 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                All Assignees
                            </option>

                            {assignees.map(
                                (assignee) => (
                                    <option
                                        key={
                                            assignee.id
                                        }
                                        value={
                                            assignee.id
                                        }
                                    >
                                        {
                                            assignee.name
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        <ChevronDownIcon className=" pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2  text-slate-500" />
                    </div>

                    {/* Tags */}
                    <div className="relative">

                        <select
                            value={
                                filters.tag ?? ''
                            }
                            onChange={(e) =>
                                setTag(
                                    e.target.value ||
                                    null
                                )
                            }
                            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-8 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                All Tags
                            </option>

                            {tags.map((tag) => (
                                <option
                                    key={tag.id}
                                    value={tag.id}
                                >
                                    {tag.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDownIcon className=" pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 " />
                    </div>

                    {/* Spacer */}

                    <div className="flex-1" />

                    {/* Clear Filters */}

                    {activeFilterCount > 0 && (
                        <button
                            onClick={() => {
                                clearFilters()
                                setSearchInput('')
                            }}
                            className=" flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium  text-slate-600 transition  hover:bg-slate-100 cursor-pointer"
                        >
                            <XMarkIcon className="h-4 w-4" />

                            Clear

                            <span
                                className=" rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
                            >
                                {activeFilterCount}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TopBar
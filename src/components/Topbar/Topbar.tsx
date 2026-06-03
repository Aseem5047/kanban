import {
    useEffect,
    useState,
} from 'react'

import {
    useTaskStore,
} from '../../stores/task.store'

import type {
    Priority,
} from '../../types/data.types'
import { useDebounce } from '../../hooks/useDebounce'

const priorities: Priority[] = [
    'low',
    'medium',
    'high',
]

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

    const togglePriority =
        useTaskStore(
            (state) =>
                state.togglePriority
        )

    const setAssignee =
        useTaskStore(
            (state) =>
                state.setAssignee
        )

    const setTag = useTaskStore(
        (state) => state.setTag
    )

    const clearFilters =
        useTaskStore(
            (state) =>
                state.clearFilters
        )

    const [
        searchInput,
        setSearchInput,
    ] = useState(
        filters.search
    )

    const debouncedSearch =
        useDebounce(
            searchInput,
            300
        )

    useEffect(() => {
        setSearch(
            debouncedSearch
        )
    }, [
        debouncedSearch,
        setSearch,
    ])

    const activeFilterCount =
        (filters.search
            ? 1
            : 0) +
        (filters.assignee
            ? 1
            : 0) +
        (filters.tag
            ? 1
            : 0) +
        (filters.priorities
            .length !== 3
            ? 1
            : 0)

    return (
        <div className="flex flex-wrap items-center gap-4 border-b p-4">
            <input
                type="text"
                placeholder="Search tasks..."
                value={
                    searchInput
                }
                onChange={(e) =>
                    setSearchInput(
                        e.target
                            .value
                    )
                }
                className="rounded border px-3 py-2"
            />

            <div className="flex gap-3">
                {priorities.map(
                    (
                        priority
                    ) => (
                        <label
                            key={
                                priority
                            }
                            className="flex items-center gap-1 capitalize"
                        >
                            <input
                                type="checkbox"
                                checked={filters.priorities.includes(
                                    priority
                                )}
                                onChange={() =>
                                    togglePriority(
                                        priority
                                    )
                                }
                            />

                            {
                                priority
                            }
                        </label>
                    )
                )}
            </div>

            <select
                value={
                    filters.assignee ??
                    ''
                }
                onChange={(e) =>
                    setAssignee(
                        e.target
                            .value ||
                        null
                    )
                }
                className="rounded border px-3 py-2"
            >
                <option value="">
                    All Assignees
                </option>

                {assignees.map(
                    (
                        assignee
                    ) => (
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

            <select
                value={
                    filters.tag ??
                    ''
                }
                onChange={(e) =>
                    setTag(
                        e.target
                            .value ||
                        null
                    )
                }
                className="rounded border px-3 py-2"
            >
                <option value="">
                    All Tags
                </option>

                {tags.map(
                    (tag) => (
                        <option
                            key={
                                tag.id
                            }
                            value={
                                tag.id
                            }
                        >
                            {tag.name}
                        </option>
                    )
                )}
            </select>

            <button
                onClick={() => {
                    clearFilters()
                    setSearchInput(
                        ''
                    )
                }}
                className="rounded border px-3 py-2"
            >
                Clear (
                {
                    activeFilterCount
                }
                )
            </button>
        </div>
    )
}

export default TopBar
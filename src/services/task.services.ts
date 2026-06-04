import type { Task, Priority, Status } from '../types/task.types'

const BASE_URL = 'http://localhost:3000/tasks'

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

/* =========================
   READ OPERATIONS
========================= */

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(BASE_URL)

  return handleResponse<Task[]>(response)
}

export const getTaskById = async (
  id: string
): Promise<Task> => {
  const response = await fetch(`${BASE_URL}/${id}`)

  return handleResponse<Task>(response)
}

export const getTasksByFilters = async (
  filters: Partial<{
    status: Status
    priority: Priority
    points: number
  }>
): Promise<Task[]> => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value))
    }
  })

  const response = await fetch(
    `${BASE_URL}?${params.toString()}`
  )

  return handleResponse<Task[]>(response)
}

/* =========================
   CREATE
========================= */

export const createTask = async (
  task: Task
): Promise<Task> => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  return handleResponse<Task>(response)
}

/* =========================
   UPDATE
========================= */

export const updateTaskById = async (
  task: Task
): Promise<Task> => {
  const response = await fetch(
    `${BASE_URL}/${task.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    }
  )

  return handleResponse<Task>(response)
}

/*
 * PATCH only specific fields
 */
export const patchTaskById = async (
  id: string,
  updates: Partial<Task>
): Promise<Task> => {
  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  )

  return handleResponse<Task>(response)
}

/* =========================
   DELETE
========================= */

export const deleteTaskById = async (
  id: string
): Promise<void> => {
  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    throw new Error(
      `Delete failed: ${response.status}`
    )
  }
}

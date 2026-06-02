import type { Task } from "../types/data.types"

const BASE_URL = 'http://localhost:3000/tasks'

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(BASE_URL)
  return response.json()
}

export const updateTaskById = async (task: Task) => {
  await fetch(`${BASE_URL}/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
}
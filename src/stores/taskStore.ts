import { defineStore } from 'pinia'

export interface Task {
  id: string
  content: string
  completed: boolean
  createdAt: string
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
  }),
  actions: {
    async fetchTasks() {
      const res = await fetch('http://localhost:3000/tasks')
      this.tasks = await res.json()
    },
    async addTask(content: string) {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const newTask = await res.json()
      this.tasks.push(newTask)
    },
    // Implementar update y delete según lo necesites
  },
})

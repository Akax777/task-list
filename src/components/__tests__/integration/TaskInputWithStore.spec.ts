// tests/integration/TaskInputWithStore.spec.ts
import { mount } from '@vue/test-utils'
import TaskInput from '@/components/TaskInput.vue'
import { createTestingPinia } from '@pinia/testing'
import { useTaskStore } from '@/stores/taskStore'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { vi } from 'vitest'

describe('TaskInput + useTaskInput + taskStore Integration', () => {
  it('agrega una tarea al store cuando se confirma', async () => {
    const wrapper = mount(TaskInput, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn, // <-- Solución
            stubActions: false,
          }),
        ],
      },
    })

    const store = useTaskStore()
    await wrapper.find('input').setValue('Nueva tarea')
    await wrapper.find('input').trigger('keydown.enter')
    expect(store.tasks).toHaveLength(1)
  })
})

// tests/unit/UserAvatar.spec.ts
import { mount } from '@vue/test-utils'
import UserAvatar from '../../../components/UserAvatar.vue'
import { describe, expect, it } from 'vitest'

describe('UserAvatar.vue', () => {
  it('muestra el avatar del usuario', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: {
          name: 'Test User',
          avatar: 'test.jpg',
        },
        hasText: true,
      },
    })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('muestra iniciales cuando no hay avatar', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: {
          name: 'Test User',
        },
        hasText: true,
      },
    })
    expect(wrapper.text()).toContain('TU')
  })

  it('reduce opacidad cuando no hay texto', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: {
          name: 'Test User',
        },
        hasText: false,
      },
    })
    expect(wrapper.classes()).toContain('opacity-40')
  })
})

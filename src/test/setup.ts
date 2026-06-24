import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import type { SetupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

export let server: SetupServer

class TestResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

globalThis.ResizeObserver = TestResizeObserver

beforeAll(async () => {
  server = await createServerWithoutNodeLocalStorageWarning()
  server.listen({
    onUnhandledRequest: 'error',
  })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

async function createServerWithoutNodeLocalStorageWarning() {
  const localStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: undefined,
  })

  try {
    const { setupServer } = await import('msw/node')
    return setupServer()
  } finally {
    if (localStorageDescriptor) {
      Object.defineProperty(globalThis, 'localStorage', localStorageDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage')
    }
  }
}

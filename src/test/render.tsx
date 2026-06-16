import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { RenderOptions } from '@testing-library/react'
import { render as testingLibraryRender } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        retry: false,
      },
    },
  })

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient
}

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options

  return {
    queryClient,
    ...testingLibraryRender(ui, {
      wrapper: createWrapper(queryClient),
      ...renderOptions,
    }),
  }
}

export { renderWithProviders as render }
export * from '@testing-library/react'

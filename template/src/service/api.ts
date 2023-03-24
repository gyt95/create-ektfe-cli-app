import { apiGet, apiPost } from '@next/core'
import type { ExampleForm } from '../types'

export const addExampleUrl = (data: ExampleForm) => apiPost('/example', data)

export const getExampleUrl = (data: ExampleForm) => apiGet('/example', data)

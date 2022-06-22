import { derived, writable } from 'svelte/store'
import { Type } from './constant'

const store = writable({ items: [] })


export const elements = derived(store, (state) => state.items)

let previous: never[] = []
export const changes = derived<typeof store, [never[], never[]]>(store, (state, set) => {
  set([state.items, previous])
  previous = state.items
})

export const type = derived(changes, (state) => {
  const [newer, older] = state

  if (!!newer && newer.length === 0 && older.length === 0) return Type.init
  if (!!newer && !!older && newer.length - older.length > 0) return Type.add
  if (!!newer && !!older && newer.length === older.length) return Type.modify
  if (!!newer && !!older && newer.length - older.length < 0) return Type.remove
})

export const load = <T>(items: T[]) => store.update((state) => ({ ...state, items: [...items as never[]] }))

export const reset = () => {
  previous = []
}


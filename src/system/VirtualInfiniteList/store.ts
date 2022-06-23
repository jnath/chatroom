import { derived, writable } from 'svelte/store'
import { Type } from './constant'

export function store(){


  const store = writable({ items: [] })

  const elements = derived(store, (state) => state.items)

  let previous: never[] = []
  const changes = derived<typeof store, [never[], never[]]>(store, (state, set) => {
    set([state.items, previous])
    previous = state.items
  })

  const type = derived(changes, (state) => {
    const [newer, older] = state

    if (!!newer && newer.length === 0 && older.length === 0) return Type.init
    if (!!newer && !!older && newer.length - older.length > 0) return Type.add
    if (!!newer && !!older && newer.length === older.length) return Type.modify
    if (!!newer && !!older && newer.length - older.length < 0) return Type.remove
  })

  const load = <T>(items: T[]) => store.update((state) => ({ ...state, items: [...items as never[]] }))

  const reset = () => {
    previous = []
  }

  return {
    elements,
    changes,
    type,
    load,
    reset
  }
}


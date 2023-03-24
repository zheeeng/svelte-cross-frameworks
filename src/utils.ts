import { SvelteComponentTyped } from "svelte";

export type SveltePropsToProps<
  Props extends Record<string, any>,
  Events extends Record<string, any>
> = Props & {
  [evt in keyof Events as `on${Capitalize<evt & string>}`]?: Events[evt] extends CustomEvent<infer P>
    ? (payload: P) => void
    : never
}

export type SvelteComponentType<P extends Record<string, any> = any, E extends Record<string, any> = any> = typeof SvelteComponentTyped<P, E>
export type SvelteComponentInstance<P extends Record<string, any> = any, E extends Record<string, any> = any> = SvelteComponentTyped<P, E>

const conventionalEventHandlerPredicate = (maybeEventName: string): string | false => {
  const match = maybeEventName.match(/^(on)([A-Z])(.*)/)

  if (match) {
    const [_, cap, resetEventName] = match

    return cap.toLowerCase() + resetEventName
  }

  return false
}

export function extractEventMapFromProps (props: Record<string, any>, eventPredicate = conventionalEventHandlerPredicate) {
  return Object.keys(props)
    // .filter((name) => name.match(/^on[A-Z]/))
    .reduce<Map<string, (payload: unknown) => void>>(
      (registration, eventName) => {
        const predicated = eventPredicate(eventName)

        if (predicated && typeof predicated === 'string') {
          registration.set(predicated, props[eventName])
        }

        return registration
      },
      new Map(),
    )
}

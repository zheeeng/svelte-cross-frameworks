import * as React from 'react'
import { extractEventMapFromProps } from './utils'
import type { SvelteComponentType, SvelteComponentInstance, SveltePropsToProps } from './utils'

export function createReactComponent<Component extends SvelteComponentType>(svelteComponent: Component): Component extends SvelteComponentType<infer P, infer E> ? React.ComponentType<SveltePropsToProps<P, E>> : never {
  const ReactComponent = React.memo(React.forwardRef<SvelteComponentInstance, Record<string, any>>(function ReactComponent(props, ref) {
    const targetRef = React.useRef()
    const componentRef = React.useRef<SvelteComponentInstance>()

    React.useImperativeHandle(ref, () => componentRef.current!)

    const eventEntries = React.useMemo(() => Array.from(extractEventMapFromProps(props)), [props])

    React.useEffect(() => {
      if (componentRef.current || !targetRef.current) {
        return
      }

      componentRef.current = new svelteComponent({ target: targetRef.current, props })


      return () => {
        componentRef.current?.$destroy?.()
        componentRef.current = undefined
      }
    }, [])

    React.useEffect(
      () => {
        if (!componentRef.current) return
        
        const offs = eventEntries.map(([eventName, handler]) => componentRef.current?.$on?.(eventName, handler))

        return () => offs.forEach(off => off?.())
      },
      [],
    )

    React.useEffect(() => {
      componentRef.current?.$set?.(props)
    }, [props])

    return React.createElement('div', { ref: targetRef })
  }))

  ReactComponent.displayName = svelteComponent.name

  return ReactComponent as any
}


import * as Vue from 'vue'
import { extractEventMapFromProps } from './utils'
import type { SvelteComponentType, SvelteComponentInstance, SveltePropsToProps } from './utils'

export function createVueComponent<Component extends SvelteComponentType>(svelteComponent: Component): Component extends SvelteComponentType<infer P, infer E> ? Vue.DefineComponent<SveltePropsToProps<P, E>> : never {
  return Vue.defineComponent({
    name: svelteComponent.name,
    data() {
      return {
        component: null as SvelteComponentInstance | null,
        offs: [] as Array<(() => void) | undefined>,
      }
    },
    computed: {
      eventEntries () {
        return Array.from(extractEventMapFromProps(this.$attrs))
      }
    },
    methods: {
      boundEvents () {
        this.offs = this.eventEntries.map(([eventName, handler]) => this.component?.$on?.(eventName, handler))
      },
      unboundEvents () {
        this.offs.forEach(off => off?.())
      }
    },
    mounted() {
      if (!this.$refs.targetRef) {
        return
      }

      this.component = new svelteComponent({
        target: this.$refs.targetRef as HTMLDivElement,
        props: this.$attrs,
      })
    },
    unmounted() {
      this.unboundEvents()
      this.component?.$destroy?.()
    },
    beforeUpdate() {
      this.unboundEvents()
    },
    updated() {
      this.component?.$set?.(this.$attrs)
      this.boundEvents()
    },
    render () {
      return Vue.h('div', { ref: 'targetRef' })
    }
  }) as never
}

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index'
  ],
  declaration: true,
  externals: ['react', 'vue', 'svelte'],
  rollup: {
    emitCJS: true
  }
})
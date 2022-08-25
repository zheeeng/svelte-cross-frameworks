# svelte-cross-frameworks

Wrapper your Svelte component to React/Vue component

## 🔥 Features

* Bind the svelte component to the React/Vue world easily.
* Pass the reactive data as props to the svelte component.
* Listen to the events emitted from the svelte component.
  * Use `onXXX` as the event callback by convention.
* Access svelte instance through `ref`.
* Typescript powered.

## 🧩 Installation

```bash
yarn add svelte-cross-frameworks (or npm/pnpm)
```

## 👇 Usage

```ts
import { createReactComponent, createVueComponent } from 'svelte-cross-frameworks'
import AwesomeSvelteComponent from './AwesomeSvelteComponent.svelte'

export const AwesomeSvelteComponentReact = createReactComponent(AwesomeSvelteComponent)
export const AwesomeSvelteComponentVue = createVueComponent(AwesomeSvelteComponent)
```

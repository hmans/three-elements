<script>
  export let url

  import { onMount } from "svelte"

  let html = undefined

  let el

  onMount(async () => {
    const res = await fetch(url)
    html = await res.text()
    el.innerHTML = html
  })
</script>

<style>
  .game {
    width: 800px;
    height: 350px;
  }

  .code {
    background-color: #f8f8f8;
    padding: 1rem;
    overflow: auto;
    outline: none;
  }
</style>

<div class="game" bind:this={el} />

<pre class="code"><code contenteditable>{html}</code></pre>

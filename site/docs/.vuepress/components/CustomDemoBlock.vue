<template>
  <div>
    <div class="demo-demo">
      <slot name="demo"></slot>
    </div>
    <div class="demo-source">
      <slot name="source"></slot>
    </div>
  </div>
</template>

<style>
.demo-demo > div {
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  padding: 10px;
  background-color: #eee;
  border-radius: 5px;
  margin: 1em 0;
}
</style>

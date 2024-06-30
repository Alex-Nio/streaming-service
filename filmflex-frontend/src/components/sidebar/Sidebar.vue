<script lang="ts" setup>
defineProps<{
  navActive: boolean,
}>();
</script>

<template>
  <aside class="sidebar" :class="{ active: navActive }">
    <button @click="$emit('toggleNav')" class="nav-button" :class="{ active: navActive }">
      <i :class="navActive ? 'icon-cancel-circle' : 'icon-menu'"></i>
    </button>
    <slot />
  </aside>
</template>

<style lang="scss" scoped>
  .nav-button {
    position: fixed;
    top: 12px;
    color: $white;
    font-size: 32px;
    left: 16px;
    transition: left 0.5s linear;

    &.active {
      left: 198px;
      @include defaultTransition;
    }
  }

  .sidebar {
    position: relative;
    flex: 1 1 0px;
    overflow: hidden;
    background-color: $black;
    min-height: 100dvh;
    max-width: 0;
    box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1);
    transition: max-width 0.5s linear, flex 0.5s linear;

    &.active {
      flex: 1 1 260px;
      max-width: 240px;
      @include defaultTransition;
    }
  }
</style>

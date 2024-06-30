<script lang="ts" setup>
  import { ref } from 'vue';
  import Sidebar from '@/components/sidebar/Sidebar.vue';
  import Navigation from '@/components/navigation/Navigation.vue';

  const navActive = ref(false);

  const toggleNav = () => navActive.value = !navActive.value;
</script>

<template>
  <div class="page">
    <Sidebar :navActive="navActive" @toggleNav="toggleNav">
      <Navigation :navActive="navActive" />
    </Sidebar>
    <main class="content">
      <div class="content__container" :class="{ active: navActive }">
        <h1 class="main-title">
          <router-link to="/" class="logo">
            FilmFlex
          </router-link>
        </h1>
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .logo {
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: $additional;
      transition: color 0.6s ease;
    }
  }

  .page {
    @include fdrjs_ais;
  }

  .content {
    display: flex;
    flex: 1 1 auto;

    &__container {
      max-width: 100vw;
      @include defaultTransition;
      margin-left: 0;

      &.active {
        max-width: calc(100vw - 240px);
        @include defaultTransition;
      }
    }
  }

  .main-title {
    @include do-upper40;
    text-align: center;
    margin-top: 6px;
  }
</style>

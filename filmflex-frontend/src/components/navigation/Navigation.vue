<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';

  defineProps<{
    navActive: boolean;
  }>();

  const menu = ref([
    { to: '/', icon: 'icon-user' },
    { to: '/search', icon: 'icon-search' },
    { to: '/movies/:id', icon: 'icon-play' },
  ]);

  const route = useRoute();
</script>

<template>
  <nav class="nav">
    <ul class="nav-list" :class="{ active: navActive }">
      <li v-for="{ to, icon } in menu" :key="to" class="nav-list__item">
        <router-link :to="to" class="nav-link">
          <i :class="icon"></i>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
  .nav {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-list {
    @include fdc;
    @include _aic;
    gap: 72px;
    opacity: 0;
    transition: opacity 0.3s linear;

    &.active {
      opacity: 1;
      @include defaultTransition;
    }

    // .nav-list__item
    &__item {
      width: 72px;
      height: 72px;
      transform: scale(1);
      transition: transform 0.3s linear;

      &:active {
        transform: scale(0.65);
        transition: transform 0.5s ease;
      }

      &:hover {
        & .nav-link {
          color: $additional;
          transition: color 0.3s linear;

          &:before {
            box-shadow: 1px 1px 100px -18px rgba(255, 255, 255, 0.72);
            background-color: rgba(255, 255, 255, 0.755);
            transition: background-color 0.3s linear;
            z-index: -1;
          }
        }
      }

      a {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 48px;

        i {
          width: 72px;
          height: 72px;
          pointer-events: none;

          &:before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }

  .router-link-active {
    color: $additional;
    transition: color 0.3s linear;
  }

  .nav-link {
    transition: color 0.3s linear;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90px;
      height: 90px;
      border-radius: 22px;
      background-color: rgba(65, 102, 104, 0);
      box-shadow: 1px 1px 80px -18px rgba(0, 0, 0, 0);
      transition: background-color 0.3s linear;
    }
  }
</style>

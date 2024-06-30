<template>
  <section>
    <div class="hero">
      <div class="hero__inner">
        <slot />
      </div>
    </div>
  </section>
</template>

<style lang='scss' scoped>
  .hero {
    width: 100%;

    // .hero__inner
    &__inner {
      padding: 30px;
      background-color: $black;
      margin: 64px 0;
    }
  }
</style>

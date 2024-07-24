<script lang="ts" setup>
  import Section from "@/components/layout/Section.vue";
  import Videoplayer from "@/components/video/player/Videoplayer.vue";
</script>

<template>
  <Section>
    <span>Avi</span>
    <Videoplayer videoSrc="src/components/video/demos/demo1.avi" />
    <span>Mov</span>
    <Videoplayer videoSrc="src/components/video/demos/demo2.mov" />
    <span>Mp4</span>
    <Videoplayer videoSrc="src/components/video/demos/demo3.mp4" />
    <span>Flv</span>
    <Videoplayer videoSrc="src/components/video/demos/demo4.flv" />
    <span>Mkv</span>
    <Videoplayer videoSrc="src/components/video/demos/demo5.mkv" />
  </Section>
</template>

<style lang="scss" scoped></style>

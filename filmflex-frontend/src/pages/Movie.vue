<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import Section from '@/components/layout/Section.vue';

const searchQuery = ref('');
const activeVideo = ref<Partial<VideoFile>>({});
const files = ref<Partial<VideoFile>[]>([]);
const HOST = 'http://localhost:8080';

interface VideoFile {
  fileName: string;
  name: string;
  length: number;
  magnetLink: string;
  magnet: string;
  author: string;
  title: string;
  category: string;
  size: string;
  quality: string;
  format: string;
  audio: string;
  seeds: string;
  peers: string;
}

const findMovie = async () => {
  console.log(searchQuery.value);
  const response = await axios.get(
    `${HOST}/movies/search?nm=${searchQuery.value}`
  );
  files.value = response.data;
};

const getFileData = async (file: Partial<VideoFile>) => {
  try {
    const { data } = await axios.get(`${HOST}/stream/add/${file.magnetLink}`);
    activeVideo.value = { fileName: data[0].name, magnetLink: file.magnetLink };
  } catch (error) {
    console.error('Error fetching stream add:', error);
    return;
  }
};

const videoUrl = computed(() => {
  console.log('computed done, filename: ', activeVideo.value.fileName);

  return activeVideo.value.fileName
    ? `${HOST}/stream/video/${activeVideo.value.magnetLink}/${activeVideo.value.fileName}`
    : '';
});
</script>

<template>
  <Section>
    <h1>Movie Page</h1>

    <div>
      <div class="video">
        <video :src="videoUrl" controls autoplay></video>
      </div>
      <hr />
      <div class="controls">
        <input
          v-model="searchQuery"
          @keyup.enter="findMovie"
          type="search"
          placeholder="Поиск фильма"
        />
        <button @click="findMovie">Найти</button>
      </div>
      <hr />
      <ul>
        <li v-for="file in files" :key="file.magnet">
          <div v-if="file.title !== 'Не найдено'" class="file-details">
            <span class="film-author">
              <strong>Автор:</strong>
              {{ file.author }}
            </span>
            <span class="film-title">
              <strong>Название:</strong>
              {{ file.title }}
            </span>
            <span class="film-category">
              <strong>Категория:</strong>
              {{ file.category }}
            </span>
            <!-- <span class="film-size">
              <strong>Размер файла:</strong>
              {{ file.size.replace('↓', '') }}
            </span> -->
            <span class="film-quality">
              <strong>Качество видео:</strong>
              {{ file.quality }}
            </span>
            <span class="film-format">
              <strong>Формат видео:</strong>
              {{ file.format }}
            </span>
            <span class="film-audio">
              <strong>Формат аудио:</strong>
              {{ file.audio }}
            </span>
            <span class="film-seeds">
              <strong>Сиды:</strong>
              {{ file.seeds }}
            </span>
            <span class="film-peers">
              <strong>Пиры:</strong>
              {{ file.peers }}
            </span>
            <button @click="getFileData(file)">добавить данные</button>
          </div>
          <div v-else class="file-details">Ничего не найдено</div>
        </li>
      </ul>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.video {
  padding: 40px;
}

.controls {
  display: flex;
  gap: 20px;
  padding: 20px 0;

  input {
    width: 420px;
    padding: 12px;
    @include nunito-b18;
  }
}

ul {
  text-decoration: none;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.file-details {
  padding: 12px;
  border: 2px solid teal;
  margin: 20px 0;
}

span {
  display: flex;
  gap: 12px;
  padding: 8px;
}

button {
  padding: 12px;
  background-color: $additional;
  color: $white;
  @include nunito-b18;
}
</style>

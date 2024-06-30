import { createApp } from 'vue';
import App from './App.vue';
import router from './app/router/index.ts';
import '@/app/styles/main.scss';

const app = createApp(App);

app.use(router).mount('#app');

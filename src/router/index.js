import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import BoardListView from '@/views/BoardListView.vue'
import BoardDetailView from '@/views/BoardDetailView.vue'
import BoardWriteView from '@/views/BoardWriteView.vue'
import BoardEditView from '@/views/BoardEditView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/board', name: 'board-list', component: BoardListView },
  { path: '/board/write', name: 'board-write', component: BoardWriteView },
  { path: '/board/:id', name: 'board-detail', component: BoardDetailView, props: true },
  { path: '/board/:id/edit', name: 'board-edit', component: BoardEditView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

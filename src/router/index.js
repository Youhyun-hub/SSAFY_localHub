import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import BoardListView from '@/views/BoardListView.vue'
import BoardDetailView from '@/views/BoardDetailView.vue'
import BoardWriteView from '@/views/BoardWriteView.vue'
import BoardEditView from '@/views/BoardEditView.vue'
import TourInfoView from '@/views/TourInfoView.vue'
import PlaceDetailView from '@/views/PlaceDetailView.vue'
import TripPlanView from '@/views/TripPlanView.vue'
import MapView from '@/views/MapView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/tour', name: 'tour-info', component: TourInfoView },
  { path: '/tour/:category/:id', name: 'place-detail', component: PlaceDetailView, props: true },
  { path: '/plan', name: 'trip-plan', component: TripPlanView },
  { path: '/board', name: 'board-list', component: BoardListView },
  { path: '/board/write', name: 'board-write', component: BoardWriteView },
  { path: '/board/:id', name: 'board-detail', component: BoardDetailView, props: true },
  { path: '/board/:id/edit', name: 'board-edit', component: BoardEditView, props: true },
  { path: '/map', name: 'map', component: MapView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

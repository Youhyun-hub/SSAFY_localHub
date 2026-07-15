<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePosts } from '@/composables/usePosts'

const { getAll, search } = usePosts()

const keyword = ref('')
const currentPage = ref(1)
const PAGE_SIZE = 7

const filtered = computed(() => (keyword.value.trim() ? search(keyword.value) : getAll()))

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

function goToPage(p) {
  currentPage.value = p
}

function formatDate(ts) {
  const d = new Date(ts)
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="board-list">
    <p class="breadcrumb">홈 &gt; 서울 동네방네</p>

    <div class="toolbar">
      <input v-model="keyword" type="text" placeholder="게시글 검색어를 입력하세요" @input="currentPage = 1" />
      <RouterLink to="/board/write" class="write-btn">+ 글쓰기</RouterLink>
    </div>

    <table class="board-table">
      <thead>
        <tr>
          <th class="col-no">번호</th>
          <th class="col-title">제목</th>
          <th class="col-views">조회</th>
          <th class="col-date">작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, idx) in pagedPosts" :key="post.id">
          <td class="col-no">{{ filtered.length - ((currentPage - 1) * PAGE_SIZE + idx) }}</td>
          <td class="col-title">
            <RouterLink :to="`/board/${post.id}`">
              {{ post.title }}
              <span v-if="post.bookmarked" title="북마크됨">🔖</span>
            </RouterLink>
          </td>
          <td class="col-views">{{ post.views }}</td>
          <td class="col-date">{{ formatDate(post.createdAt) }}</td>
        </tr>
        <tr v-if="pagedPosts.length === 0">
          <td colspan="4" class="empty-row">게시글이 없어요. 첫 글을 남겨보세요!</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">&lt;</button>
      <button
        v-for="p in totalPages"
        :key="p"
        :class="{ active: p === currentPage }"
        @click="goToPage(p)"
      >
        {{ p }}
      </button>
      <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">&gt;</button>
    </div>
  </div>
</template>

<style scoped>
.breadcrumb {
  font-size: 12px;
  color: var(--lh-muted);
  margin: 0 0 12px;
}

.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.toolbar input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--lh-line);
  border-radius: 8px;
  font-size: 14px;
}

.write-btn {
  background: var(--lh-accent);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 8px;
  white-space: nowrap;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--lh-surface);
  border: 1px solid var(--lh-line);
  border-radius: 12px;
  overflow: hidden;
}

.board-table th {
  background: var(--lh-bg);
  font-size: 13px;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid var(--lh-line);
}

.board-table td {
  padding: 12px 10px;
  font-size: 14px;
  border-bottom: 1px solid var(--lh-line);
}

.col-no, .col-views, .col-date {
  text-align: center;
  color: var(--lh-muted);
  width: 70px;
}

.empty-row {
  text-align: center;
  color: var(--lh-muted);
  padding: 24px !important;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
}

.pagination button {
  border: 1px solid var(--lh-line);
  background: var(--lh-surface);
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 13px;
}

.pagination button.active {
  background: var(--lh-accent);
  color: #fff;
  border-color: var(--lh-accent);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>

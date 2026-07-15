<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const { getById, incrementView, toggleLike, toggleBookmark, remove } = usePosts()

const post = ref(null)
const showPasswordModal = ref(false)
const modalAction = ref(null) // 'edit' | 'delete'
const passwordInput = ref('')
const passwordError = ref('')

onMounted(() => {
  incrementView(props.id)
  post.value = getById(props.id)
})

function handleLike() {
  post.value = toggleLike(props.id)
}

function handleBookmark() {
  post.value = toggleBookmark(props.id)
}

function openPasswordModal(action) {
  modalAction.value = action
  passwordInput.value = ''
  passwordError.value = ''
  showPasswordModal.value = true
}

function confirmPassword() {
  if (modalAction.value === 'edit') {
    if (passwordInput.value !== post.value.password) {
      passwordError.value = '비밀번호가 일치하지 않아요.'
      return
    }
    router.push(`/board/${props.id}/edit`)
  } else if (modalAction.value === 'delete') {
    const success = remove(props.id, passwordInput.value)
    if (!success) {
      passwordError.value = '비밀번호가 일치하지 않아요.'
      return
    }
    router.push('/board')
  }
  showPasswordModal.value = false
}

function formatDate(ts) {
  const d = new Date(ts)
  return d.toISOString().slice(0, 10)
}
</script>

<template>
  <div v-if="post" class="board-detail">
    <p class="breadcrumb">홈 &gt; 서울 동네방네 &gt; 게시글 상세</p>

    <h1>{{ post.title }}</h1>
    <p class="meta">작성일: {{ formatDate(post.createdAt) }} · 조회 {{ post.views }}</p>

    <div class="content-box">{{ post.content }}</div>

    <div class="action-row">
      <button class="icon-btn" :class="{ active: post.likedByMe }" @click="handleLike">
        👍 좋아요 {{ post.likes }}
      </button>
      <button class="icon-btn" :class="{ active: post.bookmarked }" @click="handleBookmark">
        🔖 {{ post.bookmarked ? '북마크됨' : '북마크' }}
      </button>
    </div>

    <div class="bottom-row">
      <RouterLink to="/board" class="list-btn">목록으로</RouterLink>
      <div class="edit-delete">
        <button class="edit-btn" @click="openPasswordModal('edit')">수정</button>
        <button class="delete-btn" @click="openPasswordModal('delete')">삭제</button>
      </div>
    </div>

    <!-- 비밀번호 확인 모달 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal">
        <h3>비밀번호 확인</h3>
        <input
          v-model="passwordInput"
          type="password"
          placeholder="비밀번호 입력"
          @keyup.enter="confirmPassword"
        />
        <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
        <div class="modal-actions">
          <button class="confirm-btn" @click="confirmPassword">확인</button>
          <button class="cancel-btn" @click="showPasswordModal = false">취소</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <p>게시글을 찾을 수 없어요.</p>
    <RouterLink to="/board">목록으로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.breadcrumb {
  font-size: 12px;
  color: var(--lh-muted);
  margin: 0 0 12px;
}

h1 {
  font-size: 20px;
  margin: 0 0 6px;
}

.meta {
  font-size: 12px;
  color: var(--lh-muted);
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--lh-line);
}

.content-box {
  min-height: 180px;
  white-space: pre-wrap;
  line-height: 1.7;
  font-size: 14px;
  padding: 8px 0 24px;
}

.action-row {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.icon-btn {
  border: 1px solid var(--lh-line);
  background: var(--lh-surface);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  cursor: pointer;
}

.icon-btn.active {
  border-color: var(--lh-accent);
  color: var(--lh-accent);
  background: var(--lh-accent-soft);
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--lh-line);
  padding-top: 16px;
}

.list-btn {
  border: 1px solid var(--lh-line);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.edit-delete {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid var(--lh-line);
  background: var(--lh-surface);
}

.delete-btn {
  color: var(--lh-red);
  border-color: var(--lh-red-soft);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 30, 45, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: var(--lh-surface);
  border-radius: 14px;
  padding: 24px;
  width: 280px;
}

.modal h3 {
  margin: 0 0 12px;
  font-size: 16px;
  text-align: center;
}

.modal input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--lh-line);
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 6px;
}

.error-text {
  color: var(--lh-red);
  font-size: 12px;
  margin: 0 0 8px;
}

.modal-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.confirm-btn, .cancel-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.confirm-btn {
  background: var(--lh-accent);
  color: #fff;
}

.cancel-btn {
  background: var(--lh-bg);
  color: var(--lh-ink);
}

.not-found {
  text-align: center;
  padding: 60px 0;
  color: var(--lh-muted);
}
</style>

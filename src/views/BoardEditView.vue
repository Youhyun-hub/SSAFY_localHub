<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const { getById, update } = usePosts()

const title = ref('')
const content = ref('')
const password = ref('') // 수정 완료 시 다시 한번 확인
const errorMsg = ref('')

onMounted(() => {
  const post = getById(props.id)
  if (post) {
    title.value = post.title
    content.value = post.content
  }
})

function handleSubmit() {
  errorMsg.value = ''
  if (!title.value.trim() || !content.value.trim()) {
    errorMsg.value = '제목과 내용을 모두 입력해주세요.'
    return
  }
  const success = update(props.id, {
    title: title.value,
    content: content.value,
    password: password.value,
  })
  if (!success) {
    errorMsg.value = '비밀번호가 일치하지 않아요.'
    return
  }
  router.push(`/board/${props.id}`)
}
</script>

<template>
  <div class="board-edit">
    <p class="breadcrumb">홈 &gt; 서울/경기 게시판 &gt; 글수정</p>

    <form @submit.prevent="handleSubmit">
      <label>제목</label>
      <input v-model="title" type="text" />

      <label>내용</label>
      <textarea v-model="content" rows="10"></textarea>

      <label>비밀번호 확인</label>
      <input v-model="password" type="password" placeholder="기존 비밀번호 입력" />

      <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>

      <div class="button-row">
        <button type="submit" class="submit-btn">수정 완료</button>
        <RouterLink :to="`/board/${id}`" class="cancel-btn">취소</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.breadcrumb {
  font-size: 12px;
  color: var(--lh-muted);
  margin: 0 0 16px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 13px;
  font-weight: 700;
  margin-top: 10px;
}

input, textarea {
  padding: 10px 12px;
  border: 1px solid var(--lh-line);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.error-text {
  color: #d33;
  font-size: 13px;
  margin: 8px 0 0;
}

.button-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.submit-btn {
  background: var(--lh-accent);
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  padding: 10px 24px;
  border: 1px solid var(--lh-line);
  border-radius: 8px;
  font-size: 14px;
}
</style>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'

const router = useRouter()
const { create } = usePosts()

const title = ref('')
const content = ref('')
const password = ref('')
const errorMsg = ref('')

function handleSubmit() {
  errorMsg.value = ''
  if (!title.value.trim() || !content.value.trim()) {
    errorMsg.value = '제목과 내용을 모두 입력해주세요.'
    return
  }
  if (!/^\d{4,}$/.test(password.value)) {
    errorMsg.value = '수정용 비밀번호는 숫자 4자리 이상으로 입력해주세요.'
    return
  }
  const newPost = create({ title: title.value, content: content.value, password: password.value })
  router.push(`/board/${newPost.id}`)
}
</script>

<template>
  <div class="board-write">
    <p class="breadcrumb">홈 &gt; 서울/경기 게시판 &gt; 글쓰기</p>

    <form @submit.prevent="handleSubmit">
      <label>제목</label>
      <input v-model="title" type="text" placeholder="제목을 입력하세요" />

      <label>내용</label>
      <textarea v-model="content" rows="10" placeholder="내용을 입력하세요"></textarea>

      <label>수정용 비밀번호</label>
      <input v-model="password" type="password" placeholder="숫자 4자리 이상" />
      <p class="hint">※ 수정·삭제 시 동일하게 입력해야 함</p>

      <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>

      <div class="button-row">
        <button type="submit" class="submit-btn">등록</button>
        <RouterLink to="/board" class="cancel-btn">취소</RouterLink>
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

.hint {
  font-size: 11px;
  color: var(--lh-muted);
  margin: 2px 0 0;
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

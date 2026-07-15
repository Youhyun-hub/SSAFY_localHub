<script setup>
import { ref, watch } from 'vue'
import { useChatbot } from '@/composables/useChatbot'
import { useChatbotPanel } from '@/composables/useChatbotPanel'
import { usePlaceData } from '@/composables/usePlaceData'

const inputText = ref('')

const { isOpen, toggle: togglePanel } = useChatbotPanel()
const { history, loading, sendMessage } = useChatbot()
const { allData, loaded, loadAll } = usePlaceData()

async function toggle() {
  togglePanel()
  // 챗봇을 처음 열 때 데이터가 아직 안 실렸으면 로드 (홈 화면 진입 전에 열 수도 있으므로)
  if (isOpen.value && !loaded.value) {
    await loadAll()
  }
}

// 다른 페이지(테마여행 등)에서 프리셋 메시지를 넣고 패널을 열었을 때도
// 데이터 로드가 안 되어 있으면 챙겨서 로드
watch(isOpen, async (open) => {
  if (open && !loaded.value) {
    await loadAll()
  }
})

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || loading.value) return
  inputText.value = ''
  await sendMessage(text, allData.value)
}
</script>

<template>
  <div class="chatbot-root">
    <!-- 접힌 상태: 플로팅 버튼 -->
    <button
      v-if="!isOpen"
      class="chatbot-fab"
      @click="toggle"
      aria-label="LocalHub 챗봇 열기 - 서울 여행 정보를 물어보세요"
      title="LocalHub 챗봇에게 물어보기"
    >
      <span class="chatbot-fab-icon" aria-hidden="true">💬</span>
      <span class="chatbot-fab-label">챗봇</span>
    </button>

    <!-- 펼친 상태: 대화창 -->
    <div v-else class="chatbot-panel">
      <div class="chatbot-header">
        <span>LocalHub 챗봇</span>
        <button class="close-btn" @click="toggle" aria-label="닫기">✕</button>
      </div>

      <div class="chatbot-body">
        <p v-if="history.length === 0" class="chatbot-hint">
          안녕하세요! 서울의 관광지·맛집·축제·게시글에 대해 물어보세요.
        </p>
        <div
          v-for="(msg, idx) in history"
          :key="idx"
          class="chatbot-msg"
          :class="msg.role"
        >
          {{ msg.content }}
        </div>
        <div v-if="loading" class="chatbot-msg assistant loading">답변 작성 중...</div>
      </div>

      <form class="chatbot-input-row" @submit.prevent="handleSend">
        <input
          v-model="inputText"
          type="text"
          placeholder="메시지를 입력하세요"
          :disabled="loading"
        />
        <button type="submit" :disabled="loading">전송</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chatbot-root {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 100;
}

.chatbot-fab {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 20px 0 16px;
  border-radius: 999px;
  border: none;
  background: var(--lh-accent);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(47, 111, 237, 0.35);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.chatbot-fab:hover {
  box-shadow: 0 6px 20px rgba(47, 111, 237, 0.45);
  transform: translateY(-1px);
}

.chatbot-fab-icon {
  font-size: 22px;
  line-height: 1;
}

.chatbot-fab-label {
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.chatbot-panel {
  width: 320px;
  max-height: 460px;
  background: var(--lh-surface);
  border-radius: 16px;
  border: 1px solid var(--lh-line);
  box-shadow: 0 8px 30px rgba(20, 40, 70, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  background: var(--lh-accent);
  color: #fff;
  padding: 12px 16px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.chatbot-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 200px;
}

.chatbot-hint {
  color: var(--lh-muted);
  font-size: 13px;
}

.chatbot-msg {
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 10px;
  max-width: 85%;
  line-height: 1.5;
}

.chatbot-msg.user {
  align-self: flex-end;
  background: var(--lh-accent);
  color: #fff;
}

.chatbot-msg.assistant {
  align-self: flex-start;
  background: var(--lh-bg);
  color: var(--lh-ink);
}

.chatbot-msg.loading {
  color: var(--lh-muted);
  font-style: italic;
}

.chatbot-input-row {
  display: flex;
  border-top: 1px solid var(--lh-line);
}

.chatbot-input-row input {
  flex: 1;
  border: none;
  padding: 12px;
  font-size: 14px;
  outline: none;
}

.chatbot-input-row button {
  border: none;
  background: var(--lh-accent);
  color: #fff;
  padding: 0 16px;
  font-weight: 700;
  cursor: pointer;
}

.chatbot-input-row button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 모바일에서는 전체화면으로 표시 (RFP 요구사항) */
@media (max-width: 480px) {
  .chatbot-root {
    right: 16px;
    bottom: 16px;
    left: auto;
  }
  .chatbot-fab-label {
    display: none; /* 좁은 화면에서는 아이콘만 표시 */
  }
  .chatbot-fab {
    padding: 0;
    width: 52px;
    justify-content: center;
  }
  .chatbot-root:has(.chatbot-panel) {
    right: 0;
    bottom: 0;
    left: 0;
  }
  .chatbot-panel {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>

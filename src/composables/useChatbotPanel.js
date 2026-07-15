// 챗봇 위젯의 열림/닫힘 상태를 모듈 스코프 싱글턴으로 관리합니다.
// 테마여행 페이지 등 다른 화면에서 "AI에게 물어보기" 버튼으로 플로팅 챗봇을 직접 열 때 사용해요.
import { ref } from 'vue'

const isOpen = ref(false)

export function useChatbotPanel() {
  function open() {
    isOpen.value = true
  }
  function close() {
    isOpen.value = false
  }
  function toggle() {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}

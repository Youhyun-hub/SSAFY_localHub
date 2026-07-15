// OpenAI API를 프론트엔드에서 직접 호출 (VITE_ 접두사 환경변수)
// ⚠️ 주의: 빌드 결과물에 API 키가 포함되어 브라우저에서 노출될 수 있음.
// 반드시 사용량 제한이 걸린 키만 사용하고 결제 한도를 낮게 설정할 것 (RFP 요구사항)
import { ref } from "vue";

// 전체 JSON(특히 쇼핑 4,368건)을 통째로 넘기면 토큰이 초과되므로
// 카테고리별 상위 N개만 추려 요약본을 만든다.
function buildContextSummary(allData) {
  const parts = [];
  for (const [category, items] of Object.entries(allData)) {
    const sample = items
      .slice(0, 30)
      .map((i) => `${i.title}(${i.addr1 || "주소없음"})`)
      .join(", ");
    parts.push(`[${category}] ${sample}`);
  }
  return parts.join("\n");
}

export function useChatbot() {
  const history = ref([]); // { role: 'user' | 'assistant', content: string }[]
  const loading = ref(false);
  const error = ref(null);

  async function sendMessage(userMessage, allData) {
    history.value.push({ role: "user", content: userMessage });
    loading.value = true;
    error.value = null;

    const systemPrompt =
      "당신은 서울 지역 정보 안내 챗봇입니다. 아래 데이터를 참고해 사용자 질문에 답변하세요.\n" +
      "데이터에 없는 내용은 모른다고 답하고, 지어내지 마세요.\n\n" +
      buildContextSummary(allData);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "VITE_OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.",
        );
      }

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...history.value,
          ],
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices[0].message.content;
      history.value.push({ role: "assistant", content: reply });
      return reply;
    } catch (e) {
      error.value = e.message;
      history.value.push({
        role: "assistant",
        content: `⚠️ 오류가 발생했어요: ${e.message}`,
      });
      return null;
    } finally {
      loading.value = false;
    }
  }

  return { history, loading, error, sendMessage };
}

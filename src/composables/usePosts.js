// 게시글 CRUD + 검색/조회수/좋아요/북마크(선택기능)를 한 곳에서 관리합니다.
// RFP 요구사항: 회원가입 없이 수정용 비밀번호로만 권한 확인, 평문 저장(교육 목적 의도된 설계)

const STORAGE_KEY = 'localhub_posts'

function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function usePosts() {
  function getAll() {
    return loadPosts().sort((a, b) => b.createdAt - a.createdAt)
  }

  function getById(id) {
    return loadPosts().find((p) => p.id === id) || null
  }

  function create({ title, content, password }) {
    const posts = loadPosts()
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      password,
      createdAt: Date.now(),
      views: 0,
      likes: 0,
      likedByMe: false,
      bookmarked: false,
    }
    posts.push(newPost)
    savePosts(posts)
    return newPost
  }

  // 성공 시 true, 비밀번호 불일치/게시글 없음이면 false
  function update(id, { title, content, password }) {
    const posts = loadPosts()
    const idx = posts.findIndex((p) => p.id === id)
    if (idx === -1) return false
    if (posts[idx].password !== password) return false
    posts[idx] = { ...posts[idx], title, content }
    savePosts(posts)
    return true
  }

  function remove(id, password) {
    const posts = loadPosts()
    const idx = posts.findIndex((p) => p.id === id)
    if (idx === -1) return false
    if (posts[idx].password !== password) return false
    posts.splice(idx, 1)
    savePosts(posts)
    return true
  }

  function incrementView(id) {
    const posts = loadPosts()
    const post = posts.find((p) => p.id === id)
    if (post) {
      post.views += 1
      savePosts(posts)
    }
  }

  function toggleLike(id) {
    const posts = loadPosts()
    const post = posts.find((p) => p.id === id)
    if (!post) return null
    post.likedByMe = !post.likedByMe
    post.likes += post.likedByMe ? 1 : -1
    savePosts(posts)
    return post
  }

  function toggleBookmark(id) {
    const posts = loadPosts()
    const post = posts.find((p) => p.id === id)
    if (!post) return null
    post.bookmarked = !post.bookmarked
    savePosts(posts)
    return post
  }

  function search(keyword) {
    if (!keyword?.trim()) return getAll()
    const kw = keyword.trim()
    return getAll().filter(
      (p) => p.title.includes(kw) || p.content.includes(kw)
    )
  }

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    incrementView,
    toggleLike,
    toggleBookmark,
    search,
  }
}

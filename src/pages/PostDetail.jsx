// src/pages/PostDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../assets/api'
import CombinedMarkdown from '../components/CombinedMarkdown'

export default function PostDetail() {
    const { id } = useParams()
    const nav = useNavigate()

    // 페이지 로드 상태
    const [post, setPost] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // 삭제 모달 상태
    const [open, setOpen] = useState(false)
    const [done, setDone] = useState(false)
    const [delLoading, setDelLoading] = useState(false)
    const [delErr, setDelErr] = useState('')

    const doDelete = async () => {
        setDelLoading(true)
        setDelErr('')
        try {
            await api.delete(`/posts/${id}`)
            setOpen(false)
            setDone(true) // 성공 모달
        } catch (e) {
            setDelErr(e?.response?.data?.message || '삭제에 실패했습니다.')
        } finally {
            setDelLoading(false)
        }
    }

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError('')
        setPost(null)
        setPosts([])

        if (id === 'all') {
            api.get('/posts')
                .then(r => { if (!cancelled) setPosts(r.data || []) })
                .catch(() => { if (!cancelled) setError('목록을 불러오지 못했습니다.') })
                .finally(() => { if (!cancelled) setLoading(false) })
        } else {
            api.get(`/posts/${id}`)
                .then(r => { if (!cancelled) setPost(r.data) })
                .catch(() => { if (!cancelled) { setPost(null); setError('게시글이 없습니다.') } })
                .finally(() => { if (!cancelled) setLoading(false) })
        }

        return () => { cancelled = true }
    }, [id])

    if (loading) return <p className="text-gray-500">로딩 중…</p>
    if (error)   return <p className="text-red-500">{error}</p>

    // 목록 모드
    if (id === 'all') {
        return (
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">전체 게시글</h1>
                    <Link to="/" className="text-sm text-blue-600">← 홈</Link>
                </div>

                {posts.length === 0 && <p className="text-gray-500">게시글이 없습니다.</p>}

                {posts.map(p => (
                    <section key={p.id} className="space-y-3">
                        <h2 className="text-xl font-semibold">{p.title}</h2>
                        <div className="border rounded p-4 bg-white prose max-w-none">
                            <CombinedMarkdown headMd={p.contentMd} readmeUrl={p.readmeUrl} />
                        </div>
                    </section>
                ))}
            </div>
        )
    }

    // 단건 모드
    if (!post) return <p className="text-gray-500">게시글이 없습니다.</p>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <div className="flex items-center gap-2">
                    <Link to="/" className="text-sm text-blue-600">← 목록</Link>
                    {/* 삭제 트리거 버튼 */}
                    <button
                        type="button"
                        className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
                        onClick={() => { setDelErr(''); setOpen(true) }}
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="border rounded p-4 bg-white prose max-w-none">
                <CombinedMarkdown headMd={post.contentMd} readmeUrl={post.readmeUrl} />
            </div>

            {/* 확인 모달 */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={() => !delLoading && setOpen(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog" aria-modal="true" aria-labelledby="del-title"
                    >
                        <h2 id="del-title" className="text-lg font-semibold mb-2">정말 삭제하시겠습니까?</h2>
                        <p className="text-sm text-gray-600 mb-4">이 작업은 되돌릴 수 없습니다.</p>

                        {delErr && <p className="text-sm text-red-600 mb-3">{delErr}</p>}

                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                className="px-3 py-2 rounded border hover:bg-gray-50"
                                onClick={() => setOpen(false)}
                                disabled={delLoading}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                                onClick={doDelete}
                                disabled={delLoading}
                            >
                                {delLoading ? '삭제 중…' : '삭제'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 완료 모달 */}
            {done && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={() => { setDone(false); nav('/') }}
                >
                    <div
                        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog" aria-modal="true"
                    >
                        <h2 className="text-lg font-semibold mb-2">정상적으로 삭제되었습니다.</h2>
                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                className="px-3 py-2 rounded bg-black text-white hover:bg-gray-800"
                                onClick={() => { setDone(false); nav('/') }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

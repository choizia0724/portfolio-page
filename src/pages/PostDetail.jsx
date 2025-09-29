// src/pages/PostDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../assets/api'
import CombinedMarkdown from '../components/CombinedMarkdown'

export default function PostDetail() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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
                {/*<button onClick={}></button>*/}
                <Link to="/" className="text-sm text-blue-600">← 목록</Link>
            </div>
            <div className="border rounded p-4 bg-white prose max-w-none">
                <CombinedMarkdown headMd={post.contentMd} readmeUrl={post.readmeUrl} />
            </div>
        </div>
    )
}

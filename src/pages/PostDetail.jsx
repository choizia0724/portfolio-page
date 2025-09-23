import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api} from './../assets/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function PostDetail() {
    const { id } = useParams()
    const [post, setPost] = useState(null)

    useEffect(() => {
        api.get(`/posts/${id}`).then(r => setPost(r.data)).catch(()=>setPost(null))
    }, [id])

    if (!post) return <p className="text-gray-500">로딩 또는 없음</p>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <Link to="/" className="text-sm text-blue-600">← 목록</Link>
            </div>
            <article className="bg-white border rounded-xl p-4 prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contentMd}</ReactMarkdown>
            </article>
        </div>
    )
}

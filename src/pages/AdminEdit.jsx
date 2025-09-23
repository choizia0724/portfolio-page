import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api} from './../assets/api'
import PostEditor from '../components/PostEditor'

export default function AdminEdit() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const nav = useNavigate()

    useEffect(() => {
        api.get(`/posts/${id}`).then(r => setPost(r.data)).catch(()=>setPost(null))
    }, [id])

    const update = async ({ title, contentMd }) => {
        await api.put(`/posts/${id}`, { title, contentMd })
        alert('수정 완료')
        nav(`/post/${id}`, { replace: true })
    }

    if (!post) return <p className="text-gray-500">로딩 또는 없음</p>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">게시글 수정</h1>
                <div className="flex gap-3">
                    <button className="px-3 py-1 border rounded text-red-600"
                            onClick={async ()=>{
                                if (!confirm('삭제할까요?')) return
                                await api.delete(`/posts/${id}`)
                                nav('/', { replace: true })
                            }}>
                        삭제
                    </button>
                    <Link to={`/post/${id}`} className="text-sm text-blue-600">보기</Link>
                </div>
            </div>
            <PostEditor initial={post} onSubmit={update} submitText="수정" />
        </div>
    )
}

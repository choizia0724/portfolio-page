import PostEditor from '../components/PostEditor'
import { api} from './../assets/api'
import { useNavigate, Link } from 'react-router-dom'

export default function Admin() {
    const nav = useNavigate()

    const create = async ({ title, contentMd }) => {
        await api.post('/posts', { title, contentMd })
        alert('등록 완료')
        nav('/', { replace: true })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">새 게시글</h1>
                <Link to="/" className="text-sm text-blue-600">← 목록</Link>
            </div>
            <PostEditor onSubmit={create} submitText="등록" />
        </div>
    )
}

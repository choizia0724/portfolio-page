import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api} from './../assets/api'

export default function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        api.get('/posts').then(r => setPosts(r.data)).catch(()=>setPosts([]))
    }, [])

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">포트폴리오</h1>
            {posts.map(p => (
                <Link to={`/post/${p.id}`} key={p.id} className="block bg-white border rounded-xl p-4 hover:shadow">
                    <h2 className="text-xl font-semibold">{p.title}</h2>
                    <p className="text-gray-500 text-sm">자세히 보기 →</p>
                </Link>
            ))}
            {posts.length === 0 && <p className="text-gray-500">게시글이 없습니다.</p>}
        </div>
    )
}

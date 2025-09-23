import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function PostEditor({ initial, onSubmit, submitText='저장' }) {
    const [title, setTitle] = useState('')
    const [contentMd, setMd] = useState('')

    useEffect(() => {
        setTitle(initial?.title || '')
        setMd(initial?.contentMd || '')
    }, [initial])

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <input className="w-full border rounded px-3 py-2" placeholder="제목"
                       value={title} onChange={e=>setTitle(e.target.value)} />
                <textarea className="w-full h-64 border rounded px-3 py-2 font-mono"
                          placeholder="# 마크다운 입력"
                          value={contentMd} onChange={e=>setMd(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={()=>onSubmit({ title, contentMd })}>
                    {submitText}
                </button>
            </div>
            <div className="border rounded p-3 bg-white prose max-w-none">
                <h2 className="text-lg font-semibold mb-2">미리보기</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {contentMd || '*미리보기 없음*'}
                </ReactMarkdown>
            </div>
        </div>
    )
}

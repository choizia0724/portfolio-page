
// src/components/CombinedMarkdown.jsx
import React, { useEffect, useMemo, useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

function toRawGitUrl(input) {
    if (!input) return ''
    try {
        const url = new URL(input.trim())
        if (url.hostname === 'raw.githubusercontent.com') return url.href
        if (url.hostname === 'github.com') {
            // https://github.com/owner/repo/blob/branch/path/README.md
            const m = url.pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/)
            if (m) {
                const [, owner, repo, branch, path] = m
                return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
            }
        }
        return input // 기타 URL은 그대로 시도
    } catch {
        return input
    }
}

export default function CombinedMarkdown({ headMd, readmeUrl }) {
    const [tailMd, setTail] = useState('')
    const rawUrl = useMemo(() => toRawGitUrl(readmeUrl), [readmeUrl])

    useEffect(() => {
        let abort = false
        async function run() {
            setTail('')
            if (!rawUrl) return
            try {
                const res = await fetch(rawUrl, { headers: { Accept: 'text/plain' } })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const text = await res.text()
                if (!abort) setTail(text)
            } catch (e) {
                if (!abort) setTail(`> ⚠️ README 불러오기 실패: ${e.message}`)
            }
        }
        run()
        return () => { abort = true }
    }, [rawUrl])

    const divider = headMd && tailMd ? '\n\n---\n\n' : '\n'
    const combined = (headMd || '') + divider + (tailMd || '')
    return <MarkdownRenderer>{combined}</MarkdownRenderer>
}

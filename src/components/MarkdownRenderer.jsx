// src/components/MarkdownRenderer.jsx
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkBreaks from 'remark-breaks'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

/**
 * 지원:
 * - GFM(테이블, 체크박스, 취소선, 자동링크)
 * - 수식(KaTeX), 줄바꿈
 * - 코드 하이라이트
 * - 제목 앵커(# 섹션 링크)
 */
export default function MarkdownRenderer({ children }) {
    return (
        <article className="prose max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                rehypePlugins={[
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'append' }],
                    rehypeKatex,
                    [rehypeHighlight, { ignoreMissing: true }],
                ]}
                components={{
                    code(props) {
                        const {children, className, ...rest} = props
                        const lang = /language-(\w+)/.exec(className || '')?.[1]
                        const text = String(children ?? '')
                        const onCopy = () => navigator.clipboard?.writeText(text.trim())
                        const isBlock = !!lang || text.includes('\n')
                        if (!isBlock) return <code className={className} {...rest}>{children}</code>
                        return (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={onCopy}
                                    className="absolute right-2 top-2 text-xs border rounded px-2 py-1 bg-white/70 hover:bg-white"
                                >
                                    copy
                                </button>
                                <pre className={className} {...rest}>
                  <code>{text}</code>
                </pre>
                            </div>
                        )
                    },
                    table({children, ...rest}) {
                        return (
                            <div className="overflow-x-auto">
                                <table {...rest}>{children}</table>
                            </div>
                        )
                    }
                }}
            >
                {children || ''}
            </ReactMarkdown>
        </article>
    )
}

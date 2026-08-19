'use client'

import { useEffect, useRef } from 'react'
import renderMathInElement from 'katex/dist/contrib/auto-render'
import 'katex/dist/katex.min.css'

export default function MathContent({ html }) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (containerRef.current) {
            renderMathInElement(containerRef.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true },
                ],
                throwOnError: false,
            })
        }
    }, [html])

    return (
        <>
            <style jsx global>{`
            .math-content table {
              border-collapse: collapse;
              width: 100%;
            }
            .math-content table td,
            .math-content table th {
              vertical-align: top !important;
              padding: 6px 10px;
            }
            .math-content table td pre,
            .math-content pre {
              margin: 0 !important;
              padding: 0 !important;
              font-family: monospace;
              white-space: pre-wrap;
            }
          `}</style>
            <div
                ref={containerRef}
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ lineHeight: 1.7, fontSize: 15 }}
                className="math-content"
            />
        </>
    )
}
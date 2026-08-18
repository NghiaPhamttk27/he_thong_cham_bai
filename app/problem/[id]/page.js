import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SubmitForm from './SubmitForm'
import MathContent from '@/components/MathContent'

export default async function ProblemPage({ params }) {
    const { id } = await params
    const problem = await prisma.problem.findUnique({
        where: { id: Number(id) }
    })

    if (!problem) return <div style={{ padding: 20 }}>Bài tập không tồn tại.</div>

    return (
        <div style={{ padding: 20, maxWidth: 850, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Quay lại danh sách</Link>
            <h2 style={{ marginTop: 10, color: '#0f172a' }}>{problem.title}</h2>

            {/* Hiển thị đề bài và tự động vẽ công thức toán bằng KaTeX */}
            <div style={{ padding: 20, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 20 }}>
                <MathContent html={problem.description} />
            </div>

            <SubmitForm problemId={problem.id} />
        </div>
    )
}
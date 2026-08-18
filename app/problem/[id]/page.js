import { prisma } from '@/lib/prisma'
import SubmitForm from './SubmitForm'
import Link from 'next/link'

export default async function ProblemPage({ params }) {
    const { id } = await params
    const problem = await prisma.problem.findUnique({
        where: { id: Number(id) }
    })

    if (!problem) return <div style={{ padding: 20 }}>Bài tập không tồn tại.</div>

    return (
        <div style={{ padding: 20, minWidth: 800, margin: '0 auto', fontFamily: 'sans-serif' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#0070f3' }}>← Quay lại danh sách</Link>
            <h2 style={{ marginTop: 10 }}>{problem.title}</h2>
            <div style={{ padding: 15, background: '#f5f5f5', borderRadius: 6, marginBottom: 20 }}>
                <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{problem.description}</p>
            </div>

            <SubmitForm problemId={problem.id} />
        </div>
    )
}
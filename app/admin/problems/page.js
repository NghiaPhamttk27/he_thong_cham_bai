import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProblemListActions from './ProblemListActions'

export default async function AdminProblemsPage() {
    const problems = await prisma.problem.findMany({
        orderBy: { id: 'desc' }
    })

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px 20px', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, color: '#0f172a', fontWeight: 700 }}>📚 Quản Lý Đề Bài (Admin)</h1>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Tạo, chỉnh sửa, ẩn/hiện và xóa đề bài tập</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link
                            href="/admin/problems/new"
                            style={{ background: '#16a34a', color: '#fff', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
                        >
                            + Tạo Đề Bài Mới
                        </Link>
                        <Link
                            href="/admin"
                            style={{ background: '#e2e8f0', color: '#334155', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontWeight: 500, fontSize: 14 }}
                        >
                            ← Xem Lịch Sử Nộp Bài
                        </Link>
                    </div>
                </div>

                {/* Client component xử lý nút Ẩn, Sửa, Xóa */}
                <ProblemListActions problems={problems} />

            </div>
        </div>
    )
}
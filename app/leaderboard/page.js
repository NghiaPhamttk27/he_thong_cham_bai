import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function LeaderboardPage() {
    const submissions = await prisma.submission.findMany({
        include: {
            problem: true,
        },
    })

    // Tính toán tỉ lệ điểm để sắp xếp từ cao xuống thấp
    const sortedSubmissions = submissions.map((s) => {
        const [passed, total] = s.score.split('/').map(Number)
        const ratio = total ? passed / total : 0
        return { ...s, ratio }
    }).sort((a, b) => {
        if (b.ratio !== a.ratio) {
            return b.ratio - a.ratio // Điểm cao lên trên
        }
        return new Date(b.createdAt) - new Date(a.createdAt) // Bài nộp gần nhất lên trên
    })

    const getStatusBadge = (status) => {
        const styles = {
            AC: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
            WA: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
            CE: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
            TLE: { bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' },
            RE: { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' },
            OLE: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
        }
        const s = styles[status] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' }
        return (
            <span style={{
                background: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
                padding: '2px 8px',
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 12,
                display: 'inline-block'
            }}>
                {status}
            </span>
        )
    }

    const getRankBadge = (rank) => {
        if (rank === 1) return <span style={{ fontSize: 18 }}>🥇</span>
        if (rank === 2) return <span style={{ fontSize: 18 }}>🥈</span>
        if (rank === 3) return <span style={{ fontSize: 18 }}>🥉</span>
        return <span style={{ fontWeight: 600, color: '#64748b' }}>#{rank}</span>
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, color: '#0f172a', fontWeight: 700 }}>🏆 Bảng Xếp Hạng Nộp Bài</h1>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Thứ hạng bài nộp được sắp xếp theo điểm số từ cao xuống thấp</p>
                    </div>
                    <Link
                        href="/"
                        style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 6, fontWeight: 500 }}
                    >
                        ← Trang chủ bài tập
                    </Link>
                </div>

                {/* Bảng dữ liệu */}
                <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: 13, fontWeight: 600 }}>
                                <th style={{ padding: '12px 16px', width: 80, textAlign: 'center' }}>Hạng</th>
                                <th style={{ padding: '12px 16px', width: 160 }}>Thời gian</th>
                                <th style={{ padding: '12px 16px', width: 220 }}>Họ và tên</th>
                                <th style={{ padding: '12px 16px' }}>Bài tập</th>
                                <th style={{ padding: '12px 16px', width: 100, textAlign: 'center' }}>Điểm số</th>
                                <th style={{ padding: '12px 16px', width: 110, textAlign: 'center' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>
                                        Chưa có bài nộp nào trong hệ thống.
                                    </td>
                                </tr>
                            ) : (
                                sortedSubmissions.map((s, idx) => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx < 3 ? '#fcfcfc' : (idx % 2 === 0 ? '#ffffff' : '#fafafa') }}>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{getRankBadge(idx + 1)}</td>
                                        <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>
                                            {new Date(s.createdAt).toLocaleString('vi-VN')}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{s.studentName}</td>
                                        <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>{s.problem.title}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{s.score}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{getStatusBadge(s.status)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}
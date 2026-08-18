'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProblemListActions({ problems }) {
    const router = useRouter()

    const handleToggleHide = async (problem) => {
        await fetch(`/api/problems/${problem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isHidden: !problem.isHidden })
        })
        router.refresh()
    }

    const handleDelete = async (id, title) => {
        if (confirm(`Bạn có chắc chắn muốn xóa bài: "${title}"?`)) {
            await fetch(`/api/problems/${id}`, { method: 'DELETE' })
            router.refresh()
        }
    }

    return (
        <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '12px 16px', width: 60 }}>ID</th>
                        <th style={{ padding: '12px 16px' }}>Tên Đề Bài</th>
                        <th style={{ padding: '12px 16px', width: 120, textAlign: 'center' }}>Trạng Thái</th>
                        <th style={{ padding: '12px 16px', width: 260, textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((p, idx) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#64748b' }}>#{p.id}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{p.title}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <span style={{
                                    padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700,
                                    background: p.isHidden ? '#fee2e2' : '#dcfce7',
                                    color: p.isHidden ? '#991b1b' : '#15803d',
                                    border: `1px solid ${p.isHidden ? '#fecaca' : '#bbf7d0'}`
                                }}>
                                    {p.isHidden ? 'Đang Ẩn' : 'Hiển Thị'}
                                </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                    {/* Nút Sửa */}
                                    <Link
                                        href={`/admin/problems/${p.id}/edit`}
                                        style={{ background: '#2563eb', color: '#fff', padding: '5px 10px', borderRadius: 4, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
                                    >
                                        ✏️ Sửa
                                    </Link>

                                    {/* Nút Ẩn / Hiện */}
                                    <button
                                        onClick={() => handleToggleHide(p)}
                                        style={{ background: p.isHidden ? '#16a34a' : '#ea580c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                                    >
                                        {p.isHidden ? '👁️ Hiện' : '🙈 Ẩn'}
                                    </button>

                                    {/* Nút Xóa */}
                                    <button
                                        onClick={() => handleDelete(p.id, p.title)}
                                        style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                                    >
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
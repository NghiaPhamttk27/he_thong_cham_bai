'use client'
import { useState } from 'react'
import Editor from '@monaco-editor/react'
import Link from 'next/link'

export default function SubmissionTable({ submissions }) {
    const [selectedCodeSubmission, setSelectedCodeSubmission] = useState(null)
    const [selectedTestSubmission, setSelectedTestSubmission] = useState(null)

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

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, color: '#0f172a', fontWeight: 700 }}>Lịch Sử Nộp Bài (Admin)</h1>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Tổng số lượt nộp: <strong>{submissions.length}</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link
                            href="/admin/problems"
                            style={{ fontSize: 13, color: '#15803d', textDecoration: 'none', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '8px 16px', borderRadius: 6, fontWeight: 600 }}
                        >
                            📚 Quản lý Đề bài
                        </Link>
                        <Link
                            href="/"
                            style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 6, fontWeight: 500 }}
                        >
                            ← Trang chủ
                        </Link>
                    </div>
                </div>

                {/* Bảng dữ liệu */}
                <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: 13, fontWeight: 600 }}>
                                <th style={{ padding: '12px 16px', width: 60 }}>ID</th>
                                <th style={{ padding: '12px 16px', width: 160 }}>Thời gian</th>
                                <th style={{ padding: '12px 16px', width: 200 }}>Họ và tên</th>
                                <th style={{ padding: '12px 16px' }}>Bài tập</th>
                                <th style={{ padding: '12px 16px', width: 80, textAlign: 'center' }}>Điểm</th>
                                <th style={{ padding: '12px 16px', width: 100, textAlign: 'center' }}>Trạng thái</th>
                                <th style={{ padding: '12px 16px', width: 150, textAlign: 'center' }}>Chi tiết Test</th>
                                <th style={{ padding: '12px 16px', width: 120, textAlign: 'center' }}>Mã nguồn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((s, idx) => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                                    <td style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 500 }}>#{s.id}</td>
                                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>
                                        {new Date(s.createdAt).toLocaleString('vi-VN')}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{s.studentName}</td>
                                    <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>{s.problem?.title}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>{s.score}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{getStatusBadge(s.status)}</td>

                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => setSelectedTestSubmission(s)}
                                            style={{
                                                background: '#f1f5f9',
                                                color: '#334155',
                                                border: '1px solid #cbd5e1',
                                                padding: '6px 12px',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Xem {s.details.length} Test
                                        </button>
                                    </td>

                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => setSelectedCodeSubmission(s)}
                                            style={{
                                                background: '#2563eb',
                                                color: '#ffffff',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: 6,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Xem Code
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MODAL CHI TIẾT TRẠNG THÁI TESTCASE */}
                {selectedTestSubmission && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.65)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 20
                    }}>
                        <div style={{
                            background: '#ffffff',
                            width: '100%',
                            maxWidth: 650,
                            borderRadius: 12,
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '80vh'
                        }}>
                            <div style={{ padding: '16px 20px', background: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                                        Kết Quả Testcase: {selectedTestSubmission.studentName} ({selectedTestSubmission.problem?.title})
                                    </h3>
                                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                                        Điểm: {selectedTestSubmission.score} ({selectedTestSubmission.status})
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedTestSubmission(null)}
                                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', padding: '0 8px' }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Danh sách Testcase dạng Lưới (Grid) */}
                            <div style={{ padding: 20, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                                {selectedTestSubmission.details.map((detail) => (
                                    <div key={detail.id} style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 6,
                                        padding: '8px 10px',
                                        background: '#fafafa',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 4
                                    }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                                            Test #{detail.testNumber}
                                        </span>
                                        {getStatusBadge(detail.status)}
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setSelectedTestSubmission(null)}
                                    style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL XEM CODE C++ */}
                {selectedCodeSubmission && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.65)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 20
                    }}>
                        <div style={{
                            background: '#ffffff',
                            width: '100%',
                            maxWidth: 850,
                            borderRadius: 12,
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '90vh'
                        }}>
                            <div style={{ padding: '16px 20px', background: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                                        Mã nguồn C++: {selectedCodeSubmission.studentName} ({selectedCodeSubmission.problem?.title})
                                    </h3>
                                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                                        Nộp lúc: {new Date(selectedCodeSubmission.createdAt).toLocaleString('vi-VN')} | Điểm: {selectedCodeSubmission.score} ({selectedCodeSubmission.status})
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedCodeSubmission(null)}
                                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', padding: '0 8px' }}
                                >
                                    ✕
                                </button>
                            </div>

                            <div style={{ padding: 0, height: 450 }}>
                                <Editor
                                    height="100%"
                                    language="cpp"
                                    theme="vs-dark"
                                    value={selectedCodeSubmission.code}
                                    options={{
                                        readOnly: true,
                                        fontSize: 14,
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        tabSize: 4
                                    }}
                                />
                            </div>

                            <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedCodeSubmission.code)
                                        alert('Đã sao chép code!')
                                    }}
                                    style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Sao chép Code
                                </button>
                                <button
                                    onClick={() => setSelectedCodeSubmission(null)}
                                    style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
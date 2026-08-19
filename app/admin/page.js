import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SubmissionTable from './SubmissionTable'

export default async function AdminPage({ searchParams }) {
    const cookieStore = await cookies()
    const isAuthorized = cookieStore.get('admin_auth')?.value === 'true'

    const params = await searchParams
    const hasError = params?.error === '1'

    async function handleLogin(formData) {
        'use server'
        const password = formData.get('password')
        if (password === '2709') {
            const cStore = await cookies()
            cStore.set('admin_auth', 'true', { path: '/', httpOnly: true })
            redirect('/admin')
        } else {
            redirect('/admin?error=1')
        }
    }

    if (!isAuthorized) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
                <form action={handleLogin} style={{ background: '#ffffff', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', textAlign: 'center', width: 320 }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: 18, color: '#0f172a', fontWeight: 700 }}>Quyền Truy Cập Admin</h2>
                    <p style={{ margin: '0 0 16px 0', fontSize: 13, color: '#64748b' }}>Vui lòng nhập mật khẩu để xem lịch sử nộp bài</p>

                    {hasError && (
                        <p style={{ color: '#dc2626', fontSize: 13, margin: '0 0 12px 0', fontWeight: 600 }}>
                            Mật khẩu không chính xác!
                        </p>
                    )}

                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu..."
                        autoFocus
                        required
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 14, boxSizing: 'border-box', fontSize: 14, outline: 'none' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                        Xác nhận
                    </button>
                </form>
            </div>
        )
    }

    // Tối ưu: Bỏ include testcases nặng ở đây
    const submissions = await prisma.submission.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            problem: {
                select: { id: true, title: true }
            },
            details: true
        }
    })

    return <SubmissionTable submissions={submissions} />
}
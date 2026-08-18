import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const problems = await prisma.problem.findMany()

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 768, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, color: '#0f172a', fontWeight: 700 }}>Danh Sách Bài Tập</h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Hệ thống chấm bài C++ trực tuyến</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href="/leaderboard"
              style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 14px', borderRadius: 6, fontWeight: 600 }}
            >
              🏆 Bảng Xếp Hạng
            </Link>

          </div>
        </div>

        {/* Problem List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {problems.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: 13,
                  padding: '4px 10px',
                  borderRadius: 6
                }}>
                  #{p.id}
                </span>
                <h3 style={{ margin: 0, fontSize: 16, color: '#1e293b', fontWeight: 600 }}>
                  {p.title}
                </h3>
              </div>

              <Link
                href={`/problem/${p.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Làm bài →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
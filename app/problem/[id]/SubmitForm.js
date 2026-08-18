'use client'
import { useState } from 'react'
import Editor from '@monaco-editor/react'

export default function SubmitForm({ problemId }) {
    const [studentName, setStudentName] = useState('')
    const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    // Code C++ ở đây
    return 0;
}`)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, problemId, code })
            })

            const data = await res.json()
            setResult(data)
        } catch (err) {
            alert('Có lỗi xảy ra khi nộp bài!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Họ và tên:</label>
                    <input
                        type="text"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                        style={{ width: '100%', padding: 10, boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Mã nguồn C++:</label>
                    <div style={{ border: '1px solid #ccc', borderRadius: 4, overflow: 'hidden' }}>
                        <Editor
                            height="350px"
                            language="cpp"
                            theme="vs-dark" // Có thể đổi thành "vs-light" nếu muốn nền sáng
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false }, // Ẩn bản đồ code nhỏ bên phải
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '12px 20px', background: loading ? '#ccc' : '#28a745', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}
                >
                    {loading ? 'Đang chấm bài...' : 'Nộp bài'}
                </button>
            </form>

            {result && (
                <div style={{ marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 6, background: '#f9f9f9' }}>
                    <h3>Kết quả tổng quát: {result.status}</h3>
                    <p><b>Điểm số:</b> {result.score}</p>

                    <h4>Chi tiết các testcase:</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {result.details?.map((t) => (
                            <li key={t.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
                                Test {t.testNumber}: <strong style={{ color: t.status === 'AC' ? 'green' : 'red' }}>{t.status}</strong>
                                {t.errorMessage && <span style={{ color: '#888', marginLeft: 8 }}>({t.errorMessage})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
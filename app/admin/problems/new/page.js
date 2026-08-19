'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Editor } from '@tinymce/tinymce-react'
import MathContent from '@/components/MathContent'

export default function NewProblemPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [testcases, setTestcases] = useState([])
    const [uploadingZip, setUploadingZip] = useState(false)
    const [loading, setLoading] = useState(false)

    // Xử lý Upload file ZIP testcases
    const handleZipUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingZip(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/parse-testcases', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()

            if (res.ok && data.testcases) {
                setTestcases(data.testcases)
                alert(`Đã đọc thành công ${data.total} testcase từ file zip!`)
            } else {
                alert(data.error || 'Không thể đọc file zip!')
            }
        } catch (err) {
            alert('Có lỗi xảy ra khi upload file zip!')
        } finally {
            setUploadingZip(false)
        }
    }

    // Xóa 1 testcase
    const handleDeleteTest = (index) => {
        const updated = testcases.filter((_, i) => i !== index).map((t, i) => ({
            ...t,
            testNumber: i + 1
        }))
        setTestcases(updated)
    }

    // Submit bài mới
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (testcases.length === 0) {
            if (!confirm('Bài tập chưa có testcase nào. Bạn có chắc chắn muốn tạo không?')) return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/problems', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, testcases })
            })

            if (res.ok) {
                alert('Tạo bài tập mới thành công!')
                router.push('/admin/problems')
            } else {
                const data = await res.json()
                alert(data.error || 'Có lỗi xảy ra!')
            }
        } catch (err) {
            alert('Lỗi kết nối server!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px 20px', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ maxWidth: 950, margin: '0 auto' }}>
                <Link href="/admin/problems" style={{ textDecoration: 'none', color: '#2563eb', fontSize: 14 }}>← Quay lại danh sách đề bài</Link>
                <h1 style={{ fontSize: 22, color: '#0f172a', margin: '12px 0 20px 0' }}>Soạn Thảo Đề Bài Mới</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Tên đề bài */}
                    <div>
                        <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Tên đề bài:</label>
                        <input
                            type="text"
                            placeholder="Ví dụ: Dàn đèn LED nghệ thuật"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15, boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Nội dung đề bài TinyMCE */}
                    <div>
                        <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Nội dung đề bài (Hỗ trợ LaTeX $...$):</label>
                        <div style={{ border: '1px solid #cbd5e1', borderRadius: 6, overflow: 'hidden' }}>
                            <Editor
                                tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
                                value={description}
                                onEditorChange={(content) => setDescription(content)}
                                init={{
                                    height: 320,
                                    menubar: true,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor backcolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'table charmap | removeformat | help',
                                    content_style: `
                    body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; }
                    table { border-collapse: collapse; width: 100%; }
                    table td, table th { vertical-align: top !important; padding: 6px 10px; }
                    table td pre, pre { margin: 0 !important; padding: 0 !important; font-family: monospace; white-space: pre-wrap; }
                  `
                                }}
                            />
                        </div>
                    </div>

                    {/* UPLOAD FILE ZIP TESTCASE */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>📦 Bộ Testcase (File .ZIP)</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                                    Tải lên file zip chứa các thư mục Test01, Test02... (mỗi thư mục có file .INP và .OUT)
                                </p>
                            </div>

                            <div>
                                <label style={{
                                    background: uploadingZip ? '#94a3b8' : '#2563eb',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    cursor: uploadingZip ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    display: 'inline-block'
                                }}>
                                    {uploadingZip ? '⏳ Đang đọc file ZIP...' : '📂 Chọn File ZIP Testcase'}
                                    <input
                                        type="file"
                                        accept=".zip"
                                        onChange={handleZipUpload}
                                        disabled={uploadingZip}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* HIỂN THỊ DANH SÁCH TESTCASE ĐÃ TẢI LÊN */}
                        {testcases.length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>
                                        ✅ Đã tải lên {testcases.length} testcase
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setTestcases([])}
                                        style={{ background: 'transparent', color: '#dc2626', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
                                    >
                                        Xóa tất cả test
                                    </button>
                                </div>

                                <div style={{ maxHeight: 350, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                        <thead>
                                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                                                <th style={{ padding: '8px 12px', width: 70 }}>STT</th>
                                                <th style={{ padding: '8px 12px' }}>Dữ liệu vào (Input)</th>
                                                <th style={{ padding: '8px 12px' }}>Đáp án mẫu (Output)</th>
                                                <th style={{ padding: '8px 12px', width: 60, textAlign: 'center' }}>Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testcases.map((t, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#64748b' }}>Test #{t.testNumber}</td>
                                                    <td style={{ padding: '8px 12px' }}>
                                                        <pre style={{ margin: 0, padding: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, fontFamily: 'monospace', maxHeight: 80, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                                            {t.input || '(Trống)'}
                                                        </pre>
                                                    </td>
                                                    <td style={{ padding: '8px 12px' }}>
                                                        <pre style={{ margin: 0, padding: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, fontFamily: 'monospace', maxHeight: 80, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                                            {t.output || '(Trống)'}
                                                        </pre>
                                                    </td>
                                                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteTest(idx)}
                                                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Xem Trước Đề Bài */}
                    {description && (
                        <div>
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: '#2563eb' }}>
                                👁️ Xem trước giao diện đề bài (LaTeX Rendered):
                            </label>
                            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                                <MathContent html={description} />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '12px 24px', background: loading ? '#ccc' : '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}
                    >
                        {loading ? 'Đang lưu bài tập...' : 'Lưu Bài Tập'}
                    </button>
                </form>
            </div>
        </div>
    )
}
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
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/problems', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, testcases: '[]' })
            })

            if (res.ok) {
                alert('Tạo bài tập mới thành công!')
                router.push('/admin/problems')
            }
        } catch (err) {
            alert('Có lỗi xảy ra!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px 20px', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <Link href="/admin/problems" style={{ textDecoration: 'none', color: '#2563eb', fontSize: 14 }}>← Quay lại danh sách đề bài</Link>
                <h1 style={{ fontSize: 22, color: '#0f172a', margin: '12px 0 20px 0' }}>Soạn Thảo Đề Bài Mới</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

                    <div>
                        <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Nội dung đề bài (Hỗ trợ dán trực tiếp mã LaTeX $...$):</label>
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
                                        table td, table th { 
                                        vertical-align: top !important; /* Căn top chiều dọc */
                                        padding: 6px 10px; 
                                        }
                                        table td pre, pre { 
                                        margin: 0 !important; /* Xóa khoảng trống thừa trên/dưới */
                                        padding: 0 !important;
                                        font-family: monospace;
                                        white-space: pre-wrap;
                                        }
                                    `
                                }}
                            />
                        </div>
                    </div>

                    {/* Ô Xem Trước Công Thức Toán (Live Preview) */}
                    {description && (
                        <div>
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, color: '#2563eb' }}>
                                👁️ Xem trước giao diện đề bài (Đã render LaTeX):
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
                        {loading ? 'Đang lưu...' : 'Lưu Bài Tập'}
                    </button>
                </form>
            </div>
        </div>
    )
}
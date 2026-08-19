import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req, { params }) {
    try {
        const { id } = await params
        const problemId = Number(id)
        const { title, description, testcases, isHidden } = await req.json()

        // Nếu có truyền mảng testcases mới -> xóa test cũ và tạo lại
        if (testcases && Array.isArray(testcases)) {
            await prisma.testCase.deleteMany({ where: { problemId } })
        }

        const problem = await prisma.problem.update({
            where: { id: problemId },
            data: {
                title,
                description,
                isHidden,
                ...(testcases && Array.isArray(testcases) ? {
                    testcases: {
                        create: testcases.map((t, idx) => ({
                            testNumber: t.testNumber || idx + 1,
                            input: t.input,
                            output: t.output
                        }))
                    }
                } : {})
            },
            include: { testcases: true }
        })

        return NextResponse.json(problem)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params
        await prisma.problem.delete({ where: { id: Number(id) } })
        return NextResponse.json({ message: 'Xóa bài tập thành công' })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(req, { params }) {
    try {
        const { id } = await params
        const { searchParams } = new URL(req.url)
        const isPreview = searchParams.get('preview') === 'true'

        const problem = await prisma.problem.findUnique({
            where: { id: Number(id) },
            include: {
                testcases: {
                    orderBy: { testNumber: 'asc' }
                }
            }
        })

        if (!problem) {
            return NextResponse.json({ error: 'Không tìm thấy đề bài' }, { status: 404 })
        }

        // Nếu chỉ xem trước (preview), cắt lấy 300 ký tự đầu cho siêu nhẹ
        if (isPreview && problem.testcases) {
            problem.testcases = problem.testcases.map(t => ({
                ...t,
                input: t.input ? (t.input.slice(0, 300) + (t.input.length > 300 ? '\n... (Còn tiếp)' : '')) : '',
                output: t.output ? (t.output.slice(0, 300) + (t.output.length > 300 ? '\n... (Còn tiếp)' : '')) : ''
            }))
        }

        return NextResponse.json(problem)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
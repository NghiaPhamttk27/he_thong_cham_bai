import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

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

// API Cập nhật / Ẩn hiện đề bài
export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const problemId = Number(id)
    const body = await req.json()

    // Nếu có cập nhật testcases mới
    if (body.testcases && Array.isArray(body.testcases)) {
      await prisma.testCase.deleteMany({ where: { problemId } })
    }

    const problem = await prisma.problem.update({
      where: { id: problemId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.isHidden !== undefined && { isHidden: body.isHidden }),
        ...(body.testcases && Array.isArray(body.testcases) ? {
          testcases: {
            create: body.testcases.map((t, idx) => ({
              testNumber: t.testNumber || idx + 1,
              input: t.input,
              output: t.output
            }))
          }
        } : {})
      }
    })

    // Xóa Cache 2 trang danh sách để cập nhật tức thì
    revalidatePath('/')
    revalidatePath('/admin/problems')

    return NextResponse.json(problem)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// API Xóa đề bài
export async function DELETE(req, { params }) {
  try {
    const { id } = await params
    const problemId = Number(id)

    // 1. Xóa tất cả bài nộp (Submissions) của bài tập này trước
    await prisma.submission.deleteMany({ where: { problemId } })
    
    // 2. Xóa đề bài
    await prisma.problem.delete({ where: { id: problemId } })

    // 3. Xóa Cache 2 trang danh sách
    revalidatePath('/')
    revalidatePath('/admin/problems')

    return NextResponse.json({ message: 'Xóa bài tập thành công' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
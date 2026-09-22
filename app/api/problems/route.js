import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
    try {
        const { title, description, testcases } = await req.json()

        const problem = await prisma.problem.create({
            data: {
                title,
                description,
                testcases: {
                    create: (testcases || []).map((t, idx) => ({
                        testNumber: t.testNumber || idx + 1,
                        input: t.input,
                        output: t.output
                    }))
                }
            },
            include: {
                testcases: true
            }
        })

        // Xóa cache của 2 trang danh sách để cập nhật bài mới ngay lập tức
        revalidatePath('/')
        revalidatePath('/admin/problems')

        return NextResponse.json(problem)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
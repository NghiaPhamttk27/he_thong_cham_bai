import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Cập nhật đề bài
export async function PUT(req, { params }) {
    try {
        const { id } = await params
        const { title, description, testcases, isHidden } = await req.json()

        const problem = await prisma.problem.update({
            where: { id: Number(id) },
            data: { title, description, testcases, isHidden }
        })
        return NextResponse.json(problem)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Xóa đề bài
export async function DELETE(req, { params }) {
    try {
        const { id } = await params
        await prisma.problem.delete({
            where: { id: Number(id) }
        })
        return NextResponse.json({ message: 'Xóa bài tập thành công' })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
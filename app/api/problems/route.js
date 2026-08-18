import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Tạo bài tập mới
export async function POST(req) {
    try {
        const { title, description, testcases } = await req.json()
        const problem = await prisma.problem.create({
            data: {
                title,
                description,
                testcases: testcases || '[]',
            }
        })
        return NextResponse.json(problem)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
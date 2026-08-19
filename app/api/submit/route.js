import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { judgeCpp } from '@/lib/judger'

export async function POST(req) {
    try {
        const { studentName, problemId, code } = await req.json()

        // Lấy bài tập kèm danh sách testcase đã sắp xếp theo testNumber
        const problem = await prisma.problem.findUnique({
            where: { id: Number(problemId) },
            include: {
                testcases: {
                    orderBy: { testNumber: 'asc' }
                }
            }
        })

        if (!problem) {
            return NextResponse.json({ error: 'Bài tập không tồn tại' }, { status: 404 })
        }

        // Chấm bài
        const judged = await judgeCpp(code, problem.testcases)

        // Lưu lượt nộp vào DB
        const submission = await prisma.submission.create({
            data: {
                studentName,
                problemId: Number(problemId),
                code,
                status: judged.overallStatus,
                score: judged.score,
                details: {
                    create: judged.results.map((r) => ({
                        testNumber: r.testNumber,
                        status: r.status,
                        actualOutput: r.actualOutput,
                        errorMessage: r.errorMessage
                    }))
                }
            },
            include: { details: true }
        })

        return NextResponse.json({
            status: submission.status,
            score: submission.score,
            details: submission.details
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
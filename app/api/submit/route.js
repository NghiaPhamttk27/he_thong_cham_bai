import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { judgeCpp } from '@/lib/judger'

export async function POST(req) {
    try {
        const { studentName, problemId, code } = await req.json()

        // 1. Lấy thông tin bài tập
        const problem = await prisma.problem.findUnique({
            where: { id: Number(problemId) }
        })

        if (!problem) {
            return NextResponse.json({ error: 'Không tìm thấy bài tập' }, { status: 404 })
        }

        // 2. Tiến hành chấm C++
        const testcases = JSON.parse(problem.testcases)
        const judged = await judgeCpp(code, testcases)

        // 3. Lưu vào Database (gồm cả chi tiết từng testcase)
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
                        actualOutput: r.actualOutput, // Thêm dòng này
                        errorMessage: r.errorMessage
                    }))
                }
            },
            include: {
                details: true
            }
        })

        return NextResponse.json(submission)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
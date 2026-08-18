import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'
import path from 'path'

const execPromise = util.promisify(exec)

export async function judgeCpp(code, testcases) {
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const cppPath = path.join(tempDir, `sol_${uniqueId}.cpp`)
    const exePath = path.join(tempDir, `sol_${uniqueId}.exe`)

    fs.writeFileSync(cppPath, code)
    const filesToClean = [cppPath, exePath]

    try {
        // 1. Biên dịch
        try {
            await execPromise(`"C:\\Program Files\\CodeBlocks\\MinGW\\bin\\g++.exe" "${cppPath}" -o "${exePath}"`)
        } catch (error) {
            let rawErr = error.stderr?.toString() || 'Lỗi biên dịch'
            const cleanErr = rawErr
                .replaceAll(cppPath + ':', '')
                .replaceAll(cppPath, '')
                .trim()
                .slice(0, 300)

            return {
                overallStatus: 'CE',
                score: `0/${testcases.length}`,
                results: testcases.map((_, i) => ({
                    testNumber: i + 1,
                    status: 'CE',
                    actualOutput: null,
                    errorMessage: cleanErr
                }))
            }
        }

        // 2. Chạy từng testcase
        let passed = 0
        const results = []

        for (let i = 0; i < testcases.length; i++) {
            const { input, output } = testcases[i]
            const inputPath = path.join(tempDir, `in_${uniqueId}_${i}.txt`)
            fs.writeFileSync(inputPath, input)
            filesToClean.push(inputPath)

            try {
                const { stdout } = await execPromise(`"${exePath}" < "${inputPath}"`, {
                    timeout: 2000,
                    encoding: 'utf-8',
                    maxBuffer: 10 * 1024 * 1024
                })

                const studentOutput = stdout.trim()
                if (studentOutput === output.trim()) {
                    passed++
                    results.push({ testNumber: i + 1, status: 'AC', actualOutput: studentOutput, errorMessage: null })
                } else {
                    results.push({ testNumber: i + 1, status: 'WA', actualOutput: studentOutput, errorMessage: null })
                }
            } catch (err) {
                if (err.code === 'ETIMEDOUT' || err.killed) {
                    results.push({ testNumber: i + 1, status: 'TLE', actualOutput: null, errorMessage: 'Quá thời gian (2s)' })
                } else if (err.code === 'ENOBUFS' || err.message?.includes('maxBuffer')) {
                    results.push({ testNumber: i + 1, status: 'OLE', actualOutput: null, errorMessage: 'In ra quá nhiều dữ liệu' })
                } else {
                    results.push({ testNumber: i + 1, status: 'RE', actualOutput: null, errorMessage: 'Lỗi thực thi / Tràn bộ nhớ' })
                }
            }
        }

        // Lấy trạng thái của testcase đầu tiên không phải AC
        const firstNonAC = results.find(r => r.status !== 'AC')
        const overallStatus = firstNonAC ? firstNonAC.status : 'AC'

        return {
            overallStatus,
            score: `${passed}/${testcases.length}`,
            results
        }
    } finally {
        filesToClean.forEach(file => {
            if (fs.existsSync(file)) {
                try { fs.unlinkSync(file) } catch (e) { }
            }
        })
    }
}   
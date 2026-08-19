import { NextResponse } from 'next/server'
import AdmZip from 'adm-zip'

export async function POST(req) {
    try {
        const formData = await req.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json({ error: 'Chưa tải file zip' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const zip = new AdmZip(buffer)
        const zipEntries = zip.getEntries()

        // Phân loại file theo thư mục test
        const testMap = {}

        zipEntries.forEach((entry) => {
            if (entry.isDirectory) return

            const entryName = entry.entryName.replace(/\\/g, '/') // Chuẩn hóa đường dẫn
            const parts = entryName.split('/')
            const fileName = parts.pop()
            const ext = fileName.split('.').pop().toLowerCase()

            // Lấy tên thư mục chứa (ví dụ: Test01) hoặc tên file làm ID nhóm
            const folderName = parts.length > 0 ? parts[parts.length - 1] : fileName.replace(/\.[^/.]+$/, '')

            if (!testMap[folderName]) {
                testMap[folderName] = { input: '', output: '' }
            }

            const content = entry.getData().toString('utf8').trim()

            if (['inp', 'in', 'txt'].includes(ext) && !fileName.toLowerCase().includes('out')) {
                testMap[folderName].input = content
            } else if (['out', 'ans', 'sol'].includes(ext) || fileName.toLowerCase().includes('out')) {
                testMap[folderName].output = content
            }
        })

        // Sắp xếp testcase theo thứ tự tự nhiên (Test01, Test02, ..., Test10)
        const sortedFolders = Object.keys(testMap).sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
        )

        const testcases = sortedFolders.map((folder, index) => ({
            testNumber: index + 1,
            input: testMap[folder].input,
            output: testMap[folder].output,
        }))

        return NextResponse.json({ total: testcases.length, testcases })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
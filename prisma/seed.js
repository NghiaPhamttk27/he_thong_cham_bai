const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.problem.createMany({
        data: [
            {
                title: 'Bài 1: Tính tổng A + B',
                description: 'Nhập vào 2 số nguyên A và B. In ra tổng A + B.',
                testcases: JSON.stringify([
                    { input: '1 2', output: '3' },
                    { input: '10 20', output: '30' },
                    { input: '-5 5', output: '0' }
                ])
            },
            {
                title: 'Bài 2: Kiểm tra số chẵn lẻ',
                description: 'Nhập số N. In CHAN nếu N chẵn, LE nếu N lẻ.',
                testcases: JSON.stringify([
                    { input: '4', output: 'CHAN' },
                    { input: '7', output: 'LE' }
                ])
            },
            {
                title: 'Bài 3: Tìm số lớn nhất',
                description: 'Nhập vào 2 số nguyên A và B. In ra số lớn hơn.',
                testcases: JSON.stringify([
                    { input: '3 8', output: '8' },
                    { input: '10 2', output: '10' }
                ])
            }
        ]
    })
    console.log('Thêm 3 bài tập mẫu thành công!')
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect())
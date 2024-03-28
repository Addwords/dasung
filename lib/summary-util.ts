import { db } from "@/lib/db";

// const HH = String(new Date().getHours()).padStart(2, '0');
export const monthList = async (today: string) => {

    // 오늘
    const day = await db.summary.findFirst({
        where: {
            date: today
        }
    })
    if (!day) {
        // 당일 통계등록
        await db.summary.create({
            data: {
                date: today,
                yyyy: `${today.substring(0, 4)}`,
                mm: `${today.substring(4, 6)}`,
                dd: `${today.substring(6, 8)}`,
                jdump: 0,
                odump: 0,
                rdump: 0,
                total: 0,
                company: '(주)다성 용인지점'
            }
        });
    }
    // 등록되어 있는 작업 일자 - 올해
    const monthList = await db.summary.findMany({
        where: {
            yyyy: String(new Date().getFullYear())
        },
    });

    return monthList.map((val) => {
        return { date: `${val.date}` };
    });

}
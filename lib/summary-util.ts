import { db } from "@/lib/db";

// const HH = String(new Date().getHours()).padStart(2, '0');
export const monthList = async () => {

    // 등록되어 있는 작업 일자 - 올해
    let monthList = await db.summary.findMany({
        where: {
            yyyy: String(new Date().getFullYear())
        },
    });
    return monthList.map((val) => {
        return { date: `${val.date}` };
    });

}
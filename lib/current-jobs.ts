import { db } from "@/lib/db";

export const currentJobs = async (today: string) => {

    const HH = String(new Date().getHours()).padStart(2, '0');

    // 현재시간 작업이 존재하냐
    const daywork = await db.jobs.findMany({
        where: {
            date: today
        },
    });

    // 현재시간 작업이 존재하냐
    const jobs = await db.jobs.findFirst({
        where: {
            date: today,
            time: HH
        }
    });

    if (jobs) {
        return daywork; //있으면
    }

    //새작업
    const newJobs = await db.jobs.create({
        data: {
            date: today
            , operator: ''
            , time: HH
            , job: {}
            , jTot: 0
            , oTot: 0
            , rTot: 0
            , maintenance: ''
            , company: '(주)다성 용인지점'
        }
    });

    // 당일 통계등록
    if (daywork.length == 0) {
        const newSummary = await db.summary.create({
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

    return daywork;
}
import { db } from "@/lib/db";

export const currentJobs = async (today: string) => {

    // const date = new Date();
    // const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
    const HH = String(new Date().getHours()).padStart(2, '0');

    // 기존작업이 존재하냐
    const jobs = await db.jobs.findMany({
        where: {
            date: today
        }
    });

    if (jobs.length > 0) {
        return jobs; //있으면
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

    //통계등록
    const newSummary = await db.summary.create({
        data: {
            date: '',
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

    return newJobs;
}
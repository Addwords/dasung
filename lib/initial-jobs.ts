import { db } from "@/lib/db";

export const intialJobs = async () => {

    const date = new Date();
    const today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
    const HH = String(date.getHours()).padStart(2, '0');

    // 기존작업이 존재하냐
    const jobs = await db.jobs.findMany({
        where: {
            date: today
        }
    });

    if (jobs) {
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
            , subTot: 0
            , company: '(주)다성 용인지점'
        }
    });

    //통계등록
    const newSummary = await db.summary.create({
        data: {
            date: '',
            yyyy: `${date.getFullYear()}`,
            mm: `${date.getMonth() + 1}`,
            dd: `${date.getDate()}`,
            jdump: 0,
            odump: 0,
            rdump: 0,
            total: 0,
            maintenance: '',
            company: '(주)다성 용인지점'
        }
    });

    return newJobs;
}
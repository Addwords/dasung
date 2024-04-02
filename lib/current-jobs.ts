import { db } from "@/lib/db";

export const currentJobs = async (today: string, company: string) => {

    // 오늘 작업이 존재하냐
    const daywork = await db.jobs.findMany({
        where: {
            date: today,
            company: company
        },
    });

    if (daywork.length > 0) {
        return daywork;
    }

    let jobObj = {
        date: today
        , operator: ''
        , time: ''
        , job: {}
        , jTot: 0
        , oTot: 0
        , rTot: 0
        , subTot: 0
        , company: company
    };

    let objList: any = [];
    Array(19).fill({}).forEach((val, idx) => {
        // val['time'] = String(idx + 5).padStart(2, '0');
        objList.push({
            ...jobObj
            , time: String(idx + 5).padStart(2, '0')
        })
    });

    //새작업 세트
    await db.jobs.createMany({
        data: objList
    });

    const newwork = await db.jobs.findMany({
        where: {
            date: today,
            company: company
        },
    });

    return newwork;
}
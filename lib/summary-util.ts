import { db } from "@/lib/db";
import { headers } from "next/headers";
export const dynamic = 'force-dynamic'
export const daySummary = async (today: string, company: string, dumpInfo: any) => {
    const header = headers()
    // const ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    // console.log('ip info:', ip);
    // 오늘
    const day = await db.summary.findFirst({
        where: {
            date: today,
            company: company
        }
    });
    if (day) {
        return day;
    }
    else {
        //서버에 반영될떄 이상함
        // 당월 통계등록
        try {
            if (Number.isNaN(parseInt(today)))
                throw new Error('parameter Error');
            const obj = {
                date: today,
                yyyy: `${today.substring(0, 4)}`,
                mm: `${today.substring(4, 6)}`,
                dd: `${today.substring(6, 8)}`,
                jsize: dumpInfo?.jDump,
                osize: dumpInfo?.oDump,
                rsize: dumpInfo?.rDump,
                pdsize: dumpInfo?.powderDump,
                plsize: dumpInfo?.powderLoader,
                sdsize: dumpInfo?.sedimentDump,
                slsize: dumpInfo?.sedimentLoader,
                jdump: 0,
                odump: 0,
                rdump: 0,
                jobtime: 0,
                total: 0,
                maintenance: '',
                company: company
            }
            const objList: any = [];
            Array(31).fill({}).forEach((val, idx) => {
                objList.push({
                    ...obj
                    , date: `${today.substring(0, 6) + String(idx + 1).padStart(2, '0')}`
                    , dd: String(idx + 1).padStart(2, '0')
                })
            });
            await db.summary.createMany({
                data: objList
            });
            // await db.summary.create({
            //     data: {
            //         date: today,
            //         yyyy: `${today.substring(0, 4)}`,
            //         mm: `${today.substring(4, 6)}`,
            //         dd: `${today.substring(6, 8)}`,
            //         jsize: dumpInfo?.jDump || 16,
            //         jdump: 0,
            //         osize: dumpInfo?.oDump || 16,
            //         odump: 0,
            //         rsize: dumpInfo?.rDump || 16,
            //         rdump: 0,
            //         jobtime: 0,
            //         total: 0,
            //         maintenance: '',
            //         company: company
            //     }
            // });

        } catch (e) {
            console.error(e);
        }
    }

    return await db.summary.findFirst({
        where: {
            date: today,
            company: company
        }
    });
};

export const getAssets = async (comcd: string) => {

    const asset = await db.assets.findFirst({
        select:{
            jDump:true,
            oDump:true,
            rDump: true,
            powderDump: true,
            powderLoader: true,
            sedimentDump: true,
            sedimentLoader: true,
        },
        where: {
            comCd: comcd
        }
    });

    if (asset)
        return asset;

    await db.assets.create({
        data: {
            jDump: 16,
            oDump: 16,
            rDump: 16,
            powderDump: 16,
            powderLoader: 16,
            sedimentDump: 16,
            sedimentLoader: 16,
            comCd: comcd
        }
    });

    return await db.assets.findFirst({
        where: {
            comCd: comcd
        }
    });
}

export const getCompany = async (comcd:string) => {
    return await db.company.findUnique({
        where: {
            comCd:comcd
        }
    });
}
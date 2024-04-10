import { db } from "@/lib/db";

export const daySummary = async (today: string, company: string, dumpInfo: any) => {
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
        const date = new Date();
        console.log('daySummary:',date.getHours(),date.getMinutes());
        console.log(today,company);
        // 당일 통계등록
        await db.summary.create({
            data: {
                date: today,
                yyyy: `${today.substring(0, 4)}`,
                mm: `${today.substring(4, 6)}`,
                dd: `${today.substring(6, 8)}`,
                jsize: dumpInfo?.jDump || 16,
                jdump: 0,
                osize: dumpInfo?.oDump || 16,
                odump: 0,
                rsize: dumpInfo?.rDump || 16,
                rdump: 0,
                total: 0,
                maintenance: '',
                company: company
            }
        });
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
            comCd: comcd
        }
    });

    return await db.assets.findFirst({
        where: {
            comCd: comcd
        }
    });
}
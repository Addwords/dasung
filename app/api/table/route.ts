import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export async function POST(req: Request) {
	try {

		// const {id, dump, time } = await req.json();
		// const body = await req.json();
		const { servNm,
			jobId,
			summId,
			today,
			operator,
			curtime,
			job,
			material,
			jsize, jtot,
			osize, otot,
			rsize, rtot,
			plsize, pltot,
			pdsize, pdtot,
			slsize, sltot,
			sdsize, sdtot,
			subtot,
			jobtime,
			tot,
			maintenance,
			comCd
		} = await req.json();

		if (servNm === 'setOperator') { //운전자 갱신
			await db.jobs.update({
				where: {
					id: jobId
				},
				data: {
					operator: operator
				}
			})
		} else if (servNm === 'setSummary') { //통계 갱신
			await db.summary.update({
				where: {
					id: summId
				},
				data: {
					jsize: jsize,
					osize: osize,
					rsize: rsize,
					plsize: plsize,
					pdsize: pdsize,
					slsize: slsize,
					sdsize: sdsize,
					jdump: jtot,
					odump: otot,
					rdump: rtot,
					powderLoader: pltot,
					powderDump: pdtot,
					sedimentLoader: sltot,
					sedimentDump: sdtot,
					jobtime: jobtime,
					total: tot,
					subTotal: subtot,
				}
			})
		} else if (servNm === 'setJob') { //작업 갱신
			await db.jobs.update({
				where: {
					id: jobId
				},
				data: {
					job: job,
					material: material,
					jTot: jtot,
					oTot: otot,
					rTot: rtot,
					plTot: pltot,
					pdTot: pdtot,
					slTot: sltot,
					sdTot: sdtot,
					subTot: subtot,
				}
			})
		} else if (servNm === 'setRepair') { //고장 갱신
			await db.summary.update({
				where: {
					id: summId
				},
				data: {
					maintenance: maintenance,
				}
			})
		} else if (servNm === 'getAssets') {
			const response = await db.assets.findMany({
				where: {
					comCd: comCd
				},
			});
			return NextResponse.json(response);
		} else if (servNm === 'getOperator') {
			const response = await db.user.findMany({
				where: {
					company: comCd
				},
			});
			return NextResponse.json(response);
		}
		// return NextResponse.json(table);
		return NextResponse.json(`success: ${servNm}`);
	} catch (err) {
		console.error('[SERVERS_POST]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export const dynamic = "force-static";
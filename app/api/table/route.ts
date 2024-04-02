import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export async function POST(req: Request) {
	try {

		// const {id, dump, time } = await req.json();
		// const body = await req.json();
		// console.log(body);
		const { servNm,
			jobId,
			summId,
			today,
			operator,
			curtime,
			job,
			jtot,
			otot,
			rtot,
			subtot,
			tot,
			maintenance
		} = await req.json();
		// console.log('post req:', servNm, jobId, today, operator, curtime, job, jtot, otot, rtot, maintenance);

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
					jdump: jtot,
					odump: otot,
					rdump: rtot,
					total: tot,
				}
			})
		} else if (servNm === 'setJob') { //작업 갱신
			await db.jobs.update({
				where: {
					id: jobId
				},
				data: {
					job: job,
					jTot: jtot,
					oTot: otot,
					rTot: rtot,
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
		}
		// return NextResponse.json(table);
		return NextResponse.json(`success: ${servNm}`);
	} catch (err) {
		console.error('[SERVERS_POST]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {

		const { servNm, comcd, name, role } = await req.json();
		// console.log('put req:', jobId, today, operator, curtime, job, jtot, otot, rtot, maintenance);
		if (servNm == 'setOp') {
			await db.user.create({
				data: {
					name: name,
					company: comcd,
					role: role
				}
			});
		}
		// const table = await db.jobs.upsert({
		// 	where: {
		// 		id: jobId,
		// 		date: today,
		// 		time: String(curtime),
		// 	},
		// 	update: {
		// 		job: job,
		// 		jTot: jtot,
		// 		oTot: otot,
		// 		rTot: rtot,
		// 		maintenance: maintenance
		// 	},
		// 	create: {
		// 		date: today
		// 		, operator: ''
		// 		, time: curtime
		// 		, job: JSON.parse(job)
		// 		, jTot: 0
		// 		, oTot: 0
		// 		, rTot: 0
		// 		, maintenance: ''
		// 		, company: '(주)다성 용인지점'
		// 	},
		// });

		// return NextResponse.json(table);
		return NextResponse.json('success');
	} catch (err) {
		console.error('[SERVERS_POST]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export const dynamic = "force-static";
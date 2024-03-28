import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export async function POST(req: Request) {
	try {

		// const {id, dump, time } = await req.json();
		// const body = await req.json();
		// console.log(body);
		const { servNm, jobId, today, operator, curtime, job, jtot, otot, rtot, maintenance } = await req.json();
		console.log('post req:', servNm, jobId, today, operator, curtime, job, jtot, otot, rtot, maintenance);

		if (servNm === 'setOperator') {
			const oper = await db.jobs.update({
				where: {
					id: jobId
				},
				data: {
					operator: operator
				}
			})
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
		return NextResponse.json(`success: ${servNm}`);
	} catch (err) {
		console.error('[SERVERS_POST]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {

		// const {id, dump, time } = await req.json();
		// const body = await req.json();
		// console.log(body);
		const { jobId, today, operator, curtime, job, jtot, otot, rtot, maintenance } = await req.json();
		console.log('put req:', jobId, today, operator, curtime, job, jtot, otot, rtot, maintenance);

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
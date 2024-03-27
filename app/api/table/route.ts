import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	try {

		console.log(req);
		// const body = await req.json();
		// console.log(body);
		// const { jobId, today, curtime, job, jtot, otot, rtot, maintenance } = await req.json();

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
		return NextResponse.json({ body: req });
	} catch (err) {
		console.error('[SERVERS_POST]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
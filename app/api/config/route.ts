import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
	try {

		const { servNm,
			jobId,
			summId,
			today,
			operator,
			curtime,
			job,
			jsize, jtot,
			osize, otot,
			rsize, rtot,
			subtot,
			jobtime, tot,
			maintenance,
			comCd,
			yyyy, mm, dd
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
		} else if (servNm === 'setAsset') {
			await db.assets.update({
				where: {
					comCd: comCd
				},
				data: {
					jDump: jsize,
					oDump: osize,
					rDump: rsize,
				}
			})
		} else if (servNm === 'setSummary') { //통계 갱신
			await db.summary.update({
				where: {
					id: summId
				},
				data: {
					jsize: jsize,
					jdump: jtot,
					osize: osize,
					odump: otot,
					rsize: rsize,
					rdump: rtot,
					jobtime: jobtime,
					total: tot,
				}
			})
		} else if (servNm === 'getAssets') {
			return NextResponse.json(
				await db.assets.findMany({
					where: {
						comCd: comCd
					},
				})
			);
		} else if (servNm === 'getSummaryMonth') {
			return NextResponse.json(
				await db.$queryRaw(
					Prisma.sql`
					SELECT *
					  FROM "Summary" s
					 WHERE company = ${comCd}
					   AND yyyy = ${yyyy}
					   AND mm   = ${mm}
					ORDER BY dd
				`)
			);
		} else if (servNm === 'getSummaryYear') {
			return NextResponse.json(
				await db.$queryRaw(
					Prisma.sql`
					SELECT yyyy, mm,
						sum(jobtime)::varchar jobtime,
						sum(total)::varchar total  
					  FROM "Summary" s
					 WHERE yyyy  = ${yyyy}
					   AND company = ${comCd}
					 GROUP BY yyyy, mm
				`)
			);
		} else if (servNm === 'getSummary') {
			return NextResponse.json(
				await db.$queryRaw(
					Prisma.sql`
					SELECT mm,dd,jobtime,total
					  FROM "Summary" s
					 WHERE company = ${comCd}
					   AND yyyy = ${yyyy}
					ORDER BY mm, dd
				`)
			);
		} else if (servNm === 'getCompany') {
			return NextResponse.json(
				await db.company.findMany({
				})
			);
		} else if (servNm === 'getOperator') {
			const response = await db.user.findMany({
				where: {
					company: comCd
				},
			});
			return NextResponse.json(response);
		}
		// return NextResponse.json(table);
		return NextResponse.json(`success: ${servNm}`, { status: 200 });
	} catch (err) {
		console.error('[SERVERS_POST]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {

		const { servNm, comcd, name, role } = await req.json();
		if (servNm == 'setOp') {
			await db.user.create({
				data: {
					name: name,
					company: comcd,
					role: role
				}
			});
		}
		// return NextResponse.json(table);
		return NextResponse.json('success');
	} catch (err) {
		console.error('[SERVERS_PUT]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(req: Request) {
	try {
		const { servNm, operId, comcd, name } = await req.json();
		if (servNm == 'delOp') {
			await db.user.delete({
				where: {
					id: operId
				}
			});
		}

		// return NextResponse.json(table);
		return NextResponse.json('success');
	} catch (err) {
		console.error('[SERVERS_DELETE]', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export const dynamic = "force-static";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export const getOperators = async (company: string) => {

	// 회사코드로 운전자들 가져오기
	return await db.user.findMany({
		where: {
			company: company
		},
	});

}

export const setOperator = async (company: string, name: string, role: Role) => {

	// 운전자 생성
	return await db.user.create({
		data: {
			name: name,
			company: company,
			role: role
		}
	});

}
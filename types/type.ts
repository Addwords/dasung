import { Prisma } from "@prisma/client";

export interface jobProps {
	id: string;
	date: string
	operator: string
	time: string
	job: Prisma.JsonValue
	jTot: number
	oTot: number
	rTot: number
	subTot: number
	company: string
}

export interface StringDictionary {
	[key: string]: { [key: string]: any; }
}

export interface TableProps {
	joblimit: number
	opLists: StringDictionary
}

export interface jobObj {
	date: ''
	operator: ''
	time: ''
	job: {}
	jTot: 0
	oTot: 0
	rTot: 0
	subTot: 0
	company: '(주)다성 용인지점'
}

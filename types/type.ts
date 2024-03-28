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
	maintenance: string
	company: string
}

export interface StringDictionary {
	[key: string]: { [key: string]: string; }
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
	maintenance: ''
	company: '(주)다성 용인지점'
}

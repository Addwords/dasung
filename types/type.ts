import { Prisma } from "@prisma/client";
import { ChartData, ChartOptions } from 'chart.js';

export interface jobProps {
	id: string;
	date: string
	operator: string
	time: string
	job: Prisma.JsonValue
	material: string[]
	jTot: number
	oTot: number
	rTot: number
	plTot: number
	pdTot: number
	slTot: number
	sdTot: number
	subTot: number
	company: string
}

export interface StringDictionary {
	[key: string]: { [key: string]: any; }
}

export interface TableProps {
	istoday: boolean
	comcd: string
	joblimit: number
	jobList: StringDictionary
	operators: any[]
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

export interface ChartDataState {
	barData?: ChartData;
	pieData?: ChartData;
	lineData?: ChartData;
	polarData?: ChartData;
	radarData?: ChartData;
}

export interface ChartOptionsState {
	barOptions?: ChartOptions;
	pieOptions?: ChartOptions;
	lineOptions?: ChartOptions;
	polarOptions?: ChartOptions;
	radarOptions?: ChartOptions;
}

export interface Vehicle{
	volInternal:number; //내부덤프
	volExternal:number; //외부덤프
	volLoader:	number; //로우더
	volPowderLoader:number; //석분로더
	volPowderDump:number; //석분덤프
	volSedimentLoader:	number; //토사로더
	volSedimentDump:	number; //토사덤프
}
import { currentJobs } from "@/lib/current-jobs";
import Home from "@/components/UI/Home";
import React from "react";
import { daySummary, getAssets } from "@/lib/summary-util";
import { getOperators } from "@/lib/operators";
import { useRouter } from "next/router";

const DateLayout = async ({
    children,
    params,
}: {
        children: JSX.Element
		params: any
	}) => {
	
	const company: { [key: string]: string } = {
		'001': '(주)다성 용인지점',
		'002': '(주)다성 용인제2공장 지점',
		'003': '(주)다성레미콘',
		'004': '(주)청정개발',
		'005': '(주)청정개발지점',
	};
	console.time('currentJobs');
	const jobsData = await currentJobs(params.date, params.company);
	console.timeEnd('currentJobs');
	const sumData = await daySummary(params.date, params.company);
	const operators = await getOperators(params.company);
	const dumpObj = await getAssets(params.company);
	// console.table(dumpObj);
	// console.table(sumData);
	if (jobsData) {
		return (
			<>
				<Home
					date={params.date}
					company={{cd:params.company,nm:company[params.company]}}
					operators={operators}
					jobList={jobsData}
					summInfo={sumData}
					dumpInfo={dumpObj}
				/>
			</>
		 );
	}

}
 
export default DateLayout;
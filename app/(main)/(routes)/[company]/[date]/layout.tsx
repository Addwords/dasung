import { currentJobs } from "@/lib/current-jobs";
import Home from "@/components/UI/Home";
import React from "react";
import { daySummary, getAssets } from "@/lib/summary-util";
import { getOperators } from "@/lib/operators";
import { jobProps } from "@/types/type";

const DateLayout = async ({
	children,
	params,
}: {
	children: JSX.Element
	params: any
}) => {

	const company: { [key: string]: string } = {
		'001': '(주)다성용인지점',
		'002': '(주)다성용인제2공장지점',
		'003': '(주)다성레미콘',
		'004': '(주)청정개발',
		'005': '(주)청정개발지점',
	};
	const jobsData:jobProps[] = await currentJobs(params.date, params.company);
	const dumpObj = await getAssets(params.company);
	const sumData = await daySummary(params.date, params.company, dumpObj);
	const operators = await getOperators(params.company);
	
	if (jobsData) {
		return (
			<>
				<Home
					date={params.date}
					company={{ cd: params.company, nm: company[params.company] }}
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
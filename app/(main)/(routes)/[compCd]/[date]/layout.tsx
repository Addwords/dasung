import { currentJobs } from "@/lib/current-jobs";
import Home from "@/components/UI/Home";
import React from "react";
import { daySummary, getAssets, getCompany } from "@/lib/summary-util";
import { getOperators } from "@/lib/operators";
import { jobProps } from "@/types/type";

const DateLayout = async ({
	children,
	params,
}: {
	children: JSX.Element
	params: any
}) => {

	const jobsData:jobProps[] = await currentJobs(params.date, params.compCd);
	const dumpObj = await getAssets(params.compCd);
	const sumData = await daySummary(params.date, params.compCd, dumpObj);
	const operators = await getOperators(params.compCd);
	const company = await getCompany(params.compCd);
	const compNm = company?.comNm;

	if (jobsData) {
		return (
			<>
				<Home
					date={params.date}
					company={{ cd: params.compCd, nm: compNm ?? '' }}
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
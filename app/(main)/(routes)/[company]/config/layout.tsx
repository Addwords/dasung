import { currentJobs } from "@/lib/current-jobs";
import React from "react";
import { daySummary, getAssets } from "@/lib/summary-util";
import { getOperators } from "@/lib/operators";
import DumpInfo from "@/components/UI/config/dump-info";

const ConfLayout = async ({
    children,
    params,
}: {
        children: JSX.Element
		params: any
	}) => {
	
	const jobsData = await currentJobs(params.date, params.company);
	// const sumData = await daySummary(params.date, params.company);
	// const operators = await getOperators(params.company);
	const dumpObj = await getAssets(params.company);
	if (jobsData) {
		return (
			<>
			<DumpInfo 
				obj={dumpObj}
			/>
				{children}
			</>
		 );
	}

}
 
export default ConfLayout;
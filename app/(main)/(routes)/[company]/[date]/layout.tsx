import { currentJobs } from "@/lib/current-jobs";
import Home from "@/components/UI/Home";
import React from "react";
import { daySummary } from "@/lib/summary-util";
import { SyncLoader } from "react-spinners";

const DateLayout = async ({
    children,
    params,
}: {
        children: JSX.Element
		params: any
	}) => {
	
	const company:{[key: string]:string} ={
		'001': '(주)다성 용인지점',
		'002': '(주)다성 용인제2공장 지점',
		'003': '(주)다성레미콘',
		'004': '(주)청정개발',
		'005': '(주)청정개발지점',
	}
	const jobsData = await currentJobs(params.date,company[params.company]);
	const sumData = await daySummary(params.date,company[params.company]);
	const dumpObj = { jd: 16, od: 16, rd: 16 }; //TODO: asset management 테이블 만들어야할듯

	if (jobsData) {
		return (
			<>
				<Home
					company={company[params.company]}
					jobList={jobsData}
					summInfo={sumData}
					dumpInfo={dumpObj}
				/>
			</>
		 );
	}

}
 
export default DateLayout;
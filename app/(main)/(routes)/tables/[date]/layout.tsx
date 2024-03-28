import { currentJobs } from "@/lib/current-jobs";
import Home from "@/components/UI/Home";
import React from "react";

const DateLayout = async ({
    children,
    params,
}: {
        children: JSX.Element
		params: any
	}) => {

	const jobsData = await currentJobs(params.date,'(주)다성 용인지점');
	const dumpObj = { jd: 16, od: 16, rd: 7 }; //TODO: asset management 테이블 만들어야할듯

	if (jobsData) {
		return (
			<>
				<Home
					jobList={jobsData}
					dumpInfo={dumpObj}
				/>
			</>
		 );
	}

}
 
export default DateLayout;
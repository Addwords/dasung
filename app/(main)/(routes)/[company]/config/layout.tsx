import { currentJobs } from "@/lib/current-jobs";
import React from "react";
import { daySummary, getAssets } from "@/lib/summary-util";
import { getOperators } from "@/lib/operators";
import '@/styles/layout/layout.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
// import { ChartData, ChartOptions } from 'chart.js';
import DumpInfo from "@/components/UI/config/dump-info";
import OperatorInfo from "@/components/UI/config/operator-info";
import { Button } from "primereact/button";


const company: { [key: string]: string } = {
    '001': '(주)다성 용인지점',
    '002': '(주)다성 용인제2공장 지점',
    '003': '(주)다성레미콘',
    '004': '(주)청정개발',
    '005': '(주)청정개발지점',
};


const ConfLayout = async ({
	children,
	params,
}: {
	children: JSX.Element
	params: any
}) => {

	// console.log(params);
	const jobsData = await currentJobs(params.date, params.company);
	// const sumData = await daySummary(params.date, params.company);
	const operObj = await getOperators(params.company);
	const dumpObj = await getAssets(params.company);
	if (jobsData) {
		return (
			<>
				<div className="layout-main-container">
					<div className="layout-main">
						<p className="text-900 font-large text-2xl pi-reply">{company[params.company]}</p>
						{/*  */}
						<div className="flex flex-wrap gap-2">
							<Button className="pointer-events-none" label="차량정보" severity="info" text/>
						</div>
						<div className="grid">
							<DumpInfo
								obj={dumpObj}
								comcd={params.company}
							/>
						</div>
						{/*  */}
						<div className="flex flex-wrap gap-2">
							<Button className="pointer-events-none" label="운전자 정보" severity="info" text/>
						</div>
						<div className="grid">
							<OperatorInfo
								obj={operObj}
								comcd={params.company}
							/>
						</div>
					</div>
				</div>
				{children}
			</>
		);
	}

}

export default ConfLayout;
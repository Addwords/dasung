import React from "react";
import '@/styles/layout/layout.scss';
import 'primeicons/primeicons.css';

const AnalyLayout = async ({
	children,
	params,
}: {
	children: JSX.Element
	params: any
}) => {

	// const jobsData = await currentJobs(params.date, params.company);
	// const sumData = await daySummary(params.date, params.company);
	// const operObj = await getOperators(params.company);
	// const dumpObj = await getAssets(params.company);
	return (
		<>
			<link id="theme-css" href={`/themes/shadcn/theme.css`} rel="stylesheet"></link>
			{children}
		</>
	);
}

export default AnalyLayout;
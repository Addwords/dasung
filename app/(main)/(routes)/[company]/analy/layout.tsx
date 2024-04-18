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
	return (
		<>
			<link id="theme-css" href={`/themes/shadcn/theme.css`} rel="stylesheet"></link>
			{/* <link id="sakai-css" href={`/themes/sakai/theme.css`} rel="stylesheet"></link> */}
			{children}
		</>
	);
}

export default AnalyLayout;
'use client';

import { daySummary } from "@/lib/summary-util";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/Tabs"
import { postFetcher } from "@/lib/common-fetcher";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/UI/card";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import Chart from "@/components/UI/Chart";
import { useEffect, useState } from "react";
import AnalyTable from "@/components/UI/analy/AnalyTable";

async function getSummaryMonth(comcd: string, yyyy: string, mm: string | undefined) {
	return await postFetcher('/api/config', {
		servNm: 'getSummaryMonth',
		comCd: comcd,
		yyyy: yyyy,
		mm: mm
	});

}
// let isMounted = false;

const Configure = () => {

	const param: any = useParams();
	const [isMounted, setMount] = useState(false);
	const [chartType, setChartType] = useState('bar');
	const [monthData, setMonthData] = useState([...Array(0)]);
	const [yearData, setYearData] = useState([]);

	useEffect(() => {
		setMount(true);
		const date = new Date();
		const yyyy = String(date.getFullYear());
		const mm = String(date.getMonth() + 1).padStart(2, '0');
		getSummaryMonth(param.company, yyyy, mm).then(res => {
			setMonthData(res?.data);
			getSummaryMonth(param.company, yyyy, undefined).then(res => {
				setYearData([]);
			})
		});
	}, []);
	if(!isMounted){
		return null;
	}
return (
	<>
		<div className="space-y-4 p-8 pt-6">
			<div>
				2024년 생산현황
			</div>
			<div className="flex items-center justify-between space-y-2">
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList className="">
						<TabsTrigger value="overview">일별</TabsTrigger>
						<TabsTrigger value="yearby">월별</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">
						<Card>
							<CardHeader>
								<CardTitle>4월</CardTitle>
								<div>
									<div className="flex justify-end">
										{/* <div>월을 선택</div> */}
										<div className="bg-slate-200 rounded-md">
											<i className="m-2 cursor-pointer hover:bg-slate-300 pi pi-chart-bar  " style={{ fontSize: '1.5rem' }}
												onClick={() => setChartType('bar')}></i>
											<i className="m-2 cursor-pointer hover:bg-slate-300 pi pi-chart-line " style={{ fontSize: '1.5rem' }}
												onClick={() => setChartType('line')}></i>
											{/* <i className="m-2 cursor-pointer hover:bg-slate-300 pi pi-chart-pie  " style={{ fontSize: '1.5rem' }}
													onClick={() => setChartType('pie')}></i> */}
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-2">
								{monthData.length > 0 ?
									<Chart
										vtype={'monthby'}
										ctype={chartType}
										data={monthData}
									/>
									: <div>데이터가 없습니다.</div>
								}
							</CardContent>
							<CardFooter>
								{/* <Button>Save changes</Button> */}
							</CardFooter>
						</Card>
					</TabsContent>
					<TabsContent value="yearby">
						<Card>
							<CardHeader>
								<CardTitle>2024년</CardTitle>
								<div>
									<div className="flex justify-end">
										{/* <div>월을 선택</div> */}
										<div className="bg-slate-200 rounded-md">
											<i className="m-2 cursor-pointer hover:bg-slate-300 pi pi-chart-bar  " style={{ fontSize: '1.5rem' }}
												onClick={() => setChartType('bar')}></i>
											<i className="m-2 cursor-pointer hover:bg-slate-300 pi pi-chart-line " style={{ fontSize: '1.5rem' }}
												onClick={() => setChartType('line')}></i>
											{/* <i className="m-2 cursor-pointer hover:bg-slate-300 pi pi-chart-pie  " style={{ fontSize: '1.5rem' }}
													onClick={() => setChartType('pie')}></i> */}
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-2">
								{yearData.length > 0 ?
									<Chart
										vtype={'yearby'}
										ctype={chartType}
										data={yearData}
									/>
									: <div>데이터가 없습니다.</div>
								}
							</CardContent>
							<CardFooter>
								{/* <Button>Save password</Button> */}
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
			{/*  */}
			<div className="flex">
				<AnalyTable
				
				/>
			</div>
		</div>
	</>
);
}

export default Configure;
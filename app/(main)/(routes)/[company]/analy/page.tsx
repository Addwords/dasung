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

async function getSummaryYear(comcd: string, yyyy: string) {
	return await postFetcher('/api/config', {
		servNm: 'getSummaryYear',
		comCd: comcd,
		yyyy: yyyy,
	});
}

async function getSummary(comcd: string, yyyy: string) {
	return await postFetcher('/api/config', {
		servNm: 'getSummary',
		comCd: comcd,
		yyyy: yyyy,
	});
}

let isMounted = false;

const Configure = () => {

	const param: any = useParams();
	// const [isMounted, setMount] = useState(false);
	const [chartType, setChartType] = useState('bar');
	const [tableKey, setTableKey] = useState(1);
	const [mchartKey, setMChartKey] = useState(1);
	const [ychartKey, setYChartKey] = useState(1);
	const [monthData, setMonthData] = useState([]);
	const [yearData, setYearData] = useState(new Array());
	const [tableData, setTableData] = useState({});

	const date = new Date();
	const [yyyy, setYYYY] = useState(String(date.getFullYear()));
	const [mm, setMM] = useState(String(date.getMonth() + 1).padStart(2, '0'));
	// yearArr[0].yyyy = '2024'
	useEffect(() => {
		// setMount(true);
		// if(!isMounted){
		// 	isMounted = true;
		getSummaryMonth(param.company, yyyy, mm).then(mres => {
			setMonthData(mres?.data);
			setMChartKey(Math.random());
		});

		getSummaryYear(param.company, yyyy).then(yres => {
			const yearArr = [...Array(12)].map((obj, idx) => {
				const tmp = new String(idx + 1).padStart(2, '0');
				return {
					yyyy: yyyy,
					mm: tmp,
					jobtime: '0',
					total: '0'
				};
			}); //1년치 데이터 쌓이기 전까지..

			yres?.data.forEach((obj: any) => {
				const i = parseInt(obj.mm) - 1; //존재하는 월
				yearArr[i].jobtime = obj.jobtime;
				yearArr[i].total = obj.total;
			});
			setYearData(yearArr);
			setYChartKey(Math.random());
		})

		getSummary(param.company, yyyy).then(tres => { //max 365
			// console.log(tres?.data);
			const tableObj: { [key: string]: any } = {};
			const yearArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			yearArr.map(v => {
				tableObj[v] = [];
			});
			for (let obj of tres?.data) {
				tableObj[yearArr[parseInt(obj.mm) - 1]].push(obj);
			}
			// console.log(tableObj);
			setTableData(tableObj);
		});
		// }
	}, [tableKey]);

	return (
		<>
			<div className="space-y-4 p-8 pt-6">
				<div>
					{yyyy}년 생산현황
				</div>
				<div className="flex items-center justify-between space-y-2">
					<Tabs defaultValue="overview" className="space-y-4">
						<TabsList className="">
							<TabsTrigger value="overview">일별</TabsTrigger>
							<TabsTrigger value="yearby" >월별</TabsTrigger>
						</TabsList>
						<TabsContent value="overview">
							<Card>
								<CardHeader>
									<CardTitle>{mm}월</CardTitle>
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
									{monthData ?
										<Chart
											key={mchartKey}
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
									<CardTitle>{yyyy}년</CardTitle>
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
											key={ychartKey}
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
					{Object.keys(tableData).length > 0 && <AnalyTable
						data={tableData}
						year={yyyy}
						genKey={setTableKey}
					/>}
				</div>
			</div>
		</>
	);
}

export default Configure;
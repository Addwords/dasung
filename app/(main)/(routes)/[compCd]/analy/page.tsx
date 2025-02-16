'use client';

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/Tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/UI/card";
import { Skeleton } from "@/components/UI/Skeleton";
import AnalyTable from "@/components/UI/analy/AnalyTable";
import Chart from "@/components/UI/Chart";
import { postFetcher } from "@/lib/common-fetcher";
import 'primeicons/primeicons.css';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
  } from "@/components/UI/shadcn/select"
  
 const getSummaryMonth = async (comcd: string, yyyy: string, mm: string | undefined) =>{
	return await postFetcher('/api/config', {
		servNm: 'getSummaryMonth',
		comCd: comcd,
		yyyy: yyyy,
		mm: mm
	});
}

const getSummaryYear = async (comcd: string, yyyy: string) => {
	return await postFetcher('/api/config', {
		servNm: 'getSummaryYear',
		comCd: comcd,
		yyyy: yyyy,
	});
}

const getSummary = async (comcd: string, yyyy: string) => {
	return await postFetcher('/api/config', {
		servNm: 'getSummary',
		comCd: comcd,
		yyyy: yyyy,
	});
}

const Analysis = () => {

	const param: any = useParams();
	const isMounted = useRef(false);
	const setMounted = (flag:boolean) => { isMounted.current = flag; }
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
	
	const [selectYear,setSelectYear] = useState<number[]>();
	const [selectMonth,setSelectMonth] = useState<number[]>();

	useEffect(() => {
		
		let arr:number[] = [];
		for(let i=2024;i<=date.getFullYear();i++){
			arr.push(i);
		}
		setSelectYear(arr);
		let arrM:number[] = [];
		if(Number(yyyy) === date.getFullYear()){
			for(let i=1;i<=(date.getMonth() + 1);i++){
				arrM.push(i);
			}
		}else{
			for(let i=1;i<=12;i++){
				arrM.push(i);
			}
		}
		setSelectMonth(arrM);
		getSummaryMonth(param.compCd, yyyy, mm).then(mres => {
			setMonthData(mres?.data);
			setMChartKey(Math.random());
		});

		getSummaryYear(param.compCd, yyyy).then(yres => {
			const baseArr = [...Array(12)].map((obj, idx) => {
				const tmp = new String(idx + 1).padStart(2, '0');
				return {
					yyyy: yyyy,
					mm: tmp,
					jobtime: '0',
					total: '0'
				};
			}); //1년치 데이터 쌓이기 전까지..

			for(let obj of yres?.data){
				const i = parseInt(obj.mm) - 1; //존재하는 월
				baseArr[i].jobtime = obj.jobtime;
				baseArr[i].total = obj.total;
			};
			setYearData(baseArr);
			setYChartKey(Math.random());
		})

		getSummary(param.compCd, yyyy).then(tres => { //max 365
			const tableObj: { [key: string]: any } = {};
			const yearArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			yearArr.map(v => {
				tableObj[v] = [];
			});
			for (let obj of tres?.data) {
				tableObj[yearArr[parseInt(obj.mm) - 1]].push(obj);
			}
			setTableData(tableObj);
		});
	}, [tableKey, yyyy, mm, param.compCd]);

	return (
		<>
			<div className="space-y-4 p-8 pt-6 nav">
				<div className="flex justify-center non-print">
				<Select onValueChange={e=>{
					setYYYY(e)
				}}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder={`${yyyy}년`} />
					</SelectTrigger>
					<SelectContent>
						{selectYear?.map((year,idx) => (
							<SelectItem key={idx} value={year.toString()}>
								{year}년
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				</div>
				<div className="flex items-center justify-between space-y-2 non-print">
					<Tabs defaultValue="monthby" className="space-y-4">
						<TabsList className="">
							<TabsTrigger value="monthby">일별</TabsTrigger>
							<TabsTrigger value="yearby" >월별</TabsTrigger>
						</TabsList>
						<TabsContent value="monthby">
							<Card>
								<CardHeader>
									<Select onValueChange={e=>{
										console.log('onValueChange::',String(e).padStart(2, '0'))
										setMM(String(e).padStart(2, '0'))
									}}>
										<SelectTrigger className="w-[150px]">
											<SelectValue placeholder={`${mm}월`} >
												{mm}월
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{selectMonth?.map((mon,idx) => (
												<SelectItem key={idx} value={mon.toString()}>
													{mon}월
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
											key={mchartKey}
											vtype={'monthby'}
											ctype={chartType}
											data={monthData}
										/>
										:
										<Skeleton className="h-[800px] w-[1500px] rounded-xl bg-slate-300" />
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
					{Object.keys(tableData).length > 0 &&
					<AnalyTable
						data={tableData}
						year={yyyy}
						genKey={setTableKey}
						setMount={setMounted}
					/>}
				</div>
			</div>
		</>
	);
}

export default Analysis;
'use client';

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/Tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/UI/card";
import { Skeleton } from "@/components/UI/Skeleton";
import AnalyTable from "@/components/UI/analy/AnalyTable2";
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
		servNm: 'getSummaryPowder',
		comCd: comcd,
		yyyy: yyyy,
	});
}

const Analysis = () => {

	const param: any = useParams();
	const isMounted = useRef(false);
	const setMounted = (flag:boolean) => { isMounted.current = flag; }
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

	useEffect(() => {
		// console.log('useEffect!!',isMounted.current);
		let arr:number[] = [];
		for(let i=2024;i<=date.getFullYear();i++){
			arr.push(i);
		}
		setSelectYear(arr);
		// getSummaryMonth(param.compCd, yyyy, mm).then(mres => {
		// 	setMonthData(mres?.data);
		// 	setMChartKey(Math.random());
		// });

		// getSummaryYear(param.compCd, yyyy).then(yres => {
		// 	const baseArr = [...Array(12)].map((obj, idx) => {
		// 		const tmp = new String(idx + 1).padStart(2, '0');
		// 		return {
		// 			yyyy: yyyy,
		// 			mm: tmp,
		// 			jobtime: '0',
		// 			total: '0'
		// 		};
		// 	}); //1년치 데이터 쌓이기 전까지..

		// 	for(let obj of yres?.data){
		// 		const i = parseInt(obj.mm) - 1; //존재하는 월
		// 		baseArr[i].jobtime = obj.jobtime;
		// 		baseArr[i].total = obj.total;
		// 	};
		// 	setYearData(baseArr);
		// 	setYChartKey(Math.random());
		// })

		getSummary(param.compCd, yyyy).then(tres => { //max 365
			const tableObj: { [key: string]: any } = {};
			const yearArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			yearArr.map(v => {
				tableObj[v] = [];
			});
			// console.log('getSummaryPowder:',tres?.data);
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
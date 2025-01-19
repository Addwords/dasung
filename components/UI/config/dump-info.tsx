'use client';

import { postFetcher } from "@/lib/common-fetcher";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Vehicle from "../Vehicle";
import { useParams } from "next/navigation";

const DumpInfo = (props: any) => {

	const dumpInfo = props.obj;
	const {compCd} = useParams();
	const toast = useRef<Toast>(null);

	const dumpModify = (kind: string, size:number) => {
		const dumpObj: { [key: string]: any; } = {
			servNm: 'setAsset',
			comCd: props.comcd
		};
		const vehicleMap:{ [key: string]: string; } = {
			'jDump' : 'jsize',	
			'oDump' : 'osize',
			'rDump' : 'rsize',	
			'powderDump' : 'pdsize',	
			'powderLoader' : 'plsize',	
			'sedimentDump' : 'sdsize',	
			'sedimentLoader' : 'slsize',	
		};
		dumpObj[vehicleMap[kind]] = size;

		postFetcher('/api/config', dumpObj)
		.then(res => {
			if (res?.status === 200) {
				toast.current?.show({
					severity: 'info',
					summary: 'Confirmed',
					detail: '변경되었습니다.',
					life:2000
				});
			}
		});
	};
	
	const [vecArr,setVecArr] = useState<any>([]);
	
	useEffect(()=>{
		let vehicleList: { [x: string]: any; }[] = [
			{
			 'jDump' 			: {title:'내부덤프', back:'bg-white', 	color:'text-black'}
			,'oDump' 			: {title:'외부덤프', back:'bg-yellow-100',	color:'text-yellow-500'}
			,'rDump' 			: {title:'로우더',	back:'bg-blue-100', 	color:'text-blue-500'}
			},];
			if(compCd == '102'){
				vehicleList.push({
					'powderDump' 		: {title:'석분덤프', back:'bg-gray-400', 	color:'text-black-400'}
				   ,'powderLoader' 	: {title:'석분로더', back:'bg-gray-400', 	color:'text-black-400'}
				   });
				vehicleList.push({
				'sedimentDump' 	: {title:'토사덤프', back:'bg-green-100', 	color:'text-green-500'}
				,'sedimentLoader' 	: {title:'토사로더', back:'bg-green-100', 	color:'text-green-500'}
				});
			}
		vehicleList.forEach((obj)=>{
			Object.keys(dumpInfo).map((val)=>{
				if(obj[val]){
					obj[val].size = dumpInfo[val];
					obj[val].type = val;
				}
			});
		});
		console.log('vehicleList:',vehicleList);
		setVecArr(vehicleList);
	},[]);

	return (
		<>
			{/* 자가덤프, 외부덤프, 로우더 셋팅 */}
			<Toast  ref={toast} />
			{vecArr.map((obj:any,idx:number)=>(
				<div className="grid" key={idx}>
					{Object.keys(obj).map((val,idx)=>(
						<Vehicle
							key={idx}
							class={"xl:col-3"}
							name={obj[val].title}
							type={obj[val].type}
							value={obj[val].size}
							backColor={obj[val].back}
							color={obj[val].color}
							callback={dumpModify}
						/>
					))}
				</div>
			))}
		</>
	);
}

export default DumpInfo;
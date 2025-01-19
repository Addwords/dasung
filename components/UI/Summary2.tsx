import { useEffect, useState } from "react";
import { jobs } from "@/lib/common/common-job";

const Summary = (props: any) => {
	// const {compCd} = useParams();
	// const isToday = true;
	const numberFormat = (num:number=0) =>{
		return new Intl.NumberFormat().format(num ?? 0);
	};
	const subSum = (category:string)=>{
		if(typeof props.dump === 'undefined') return 0;
		if(category === 'stone'){
			let result = 0;
			result = 
				 (props.j * (props.dump.jdump - props.dump.pdump - props.dump.sdump)) // 자가덤프 : 용량 * (자가덤프용량 - 석분덤프용량 - 토사덤프용량)
				 + (props.o * props.dump.odump) // 외부덤프 : 용량 * 외부덤프용량
				 + (props.r * (props.dump.rdump - props.dump.ploader - props.dump.sloader)); // 로우더 : 용량 * (로우더용량 - 석분로우더용량 - 토사로우더용량)
			return result;
		}else if(category === 'powder'){
			return (props.pl * props.dump.ploader) + (props.pd * props.dump.pdump) + (props.sl * props.dump.sloader) + (props.sd * props.dump.sdump);
		}
	};

	useEffect(()=>{
		// setInputNumberValue(props.dump);
		console.log('props:',props.dump);
	},[props.dump]);

	return (
		<div className="flex w-[1000px] flex-wrap justify-between border-4 border-black">
			{props.compCd == '102' && //다성2일때만
			<>
				<div className="flex text-center">
					<div className="font-bold text-xl p-5 mr-3 border-r-2 border-gray-300">
						<p>자가덤프 {props.j}m<sup>3</sup> x {props.dump.jdump - props.dump.pdump - props.dump.sdump} = { numberFormat(props.j * (props.dump.jdump - props.dump.pdump - props.dump.sdump)) }m<sup>3</sup></p>
						<p>외부덤프 {props.o}m<sup>3</sup> x {props.dump.odump} = { numberFormat(props.o * props.dump.odump) }m<sup>3</sup></p>
						<p>로우더 	{props.r}m<sup>3</sup> x {props.dump.rdump - props.dump.ploader - props.dump.sloader} = { numberFormat(props.r * (props.dump.rdump - props.dump.ploader - props.dump.sloader)) }m<sup>3</sup></p>
					</div>
					<div className="">
						<p className="font-bold text-xl pt-6">총 <label id="total" htmlFor="">{subSum('stone')}</label>m<sup>3</sup></p>
					</div>
				</div>
				<div className="flex border-l-2 border-gray-800">
					<div className="font-bold text-xl p-5 mr-3 border-r-2 border-gray-3">
						<p>석분로우더 	{props.pl}m<sup>3</sup> x {props.dump.ploader} = { numberFormat(props.pl * props.dump.ploader) }m<sup>3</sup></p>
						<p>석분덤프 	{props.pd}m<sup>3</sup> x {props.dump.pdump}   = { numberFormat(props.pd * props.dump.pdump)   }m<sup>3</sup></p>
						<p>토사로우더 	{props.sl}m<sup>3</sup> x {props.dump.sloader} = { numberFormat(props.sl * props.dump.sloader) }m<sup>3</sup></p>
						<p>토사덤프 	{props.sd}m<sup>3</sup> x {props.dump.sdump}   = { numberFormat(props.sd * props.dump.sdump)   }m<sup>3</sup></p>
					</div>
					<div className="flex-col">
						<p className="font-bold text-xl pt-6">총 <label id="total" htmlFor="">{subSum('powder')}</label>m<sup>3</sup></p>
						<br/>
						1공장<br/>
						▶2공장 이동
					</div>
				</div>
				<div className="flex border-l-2 border-gray-800">
					<div className="font-bold text-xl p-5">
						합계
						<p>{`${subSum('stone')} + ${subSum('powder')}`}</p>
						<p><label htmlFor="">{numberFormat(Number(subSum('stone')) + Number(subSum('powder')))}</label>m<sup>3</sup></p>
					</div>
				</div>
			</>
			}
			{props.compCd != '102' &&
			<>
				<div className="flex text-center w-[85%]">
					<div className="w-full font-bold text-center text-xl p-5 mr-3">
						<p>자가덤프 {props.j}m<sup>3</sup> x {props.dump.jdump - props.dump.pdump - props.dump.sdump} = { numberFormat(props.j * (props.dump.jdump - props.dump.pdump - props.dump.sdump)) }m<sup>3</sup></p>
						<p>외부덤프 {props.o}m<sup>3</sup> x {props.dump.odump} = { numberFormat(props.o * props.dump.odump) }m<sup>3</sup></p>
						<p>로우더 	{props.r}m<sup>3</sup> x {props.dump.rdump - props.dump.ploader - props.dump.sloader} = { numberFormat(props.r * (props.dump.rdump - props.dump.ploader - props.dump.sloader)) }m<sup>3</sup></p>
					</div>
				</div>
				<div className="flex border-l-2 w-[15%] border-gray-800">
					<div className="font-bold text-xl p-5">
						총
						<p><label htmlFor="">{numberFormat(Number(subSum('stone')))}</label>m<sup>3</sup></p>
					</div>
				</div>
			</>
			}
			<div className="flex w-[1000px] border-t-2 border-black">
				<div className="flex w-20 text-center p-3 border-r-2 border-black items-center">
					<p>
					정비<br/>
					 및 <br/>
					수리 내용
					</p>
				</div>
				<div className="flex w-full p-3">
					<div id="rep" style={{textAlign:'left', paddingLeft:'5%', minHeight:'100px'}} className="text-lg">
						{props.maintenance.split(',').map((txt: string, idx: number) => (
							<p key={idx} className="rep-list" onClick={evt => {
								const tgt = evt.target as HTMLElement;
								tgt && tgt.remove();
								const rep = document.getElementById('rep') as HTMLElement;
								jobs.updateMaintenance(rep);
							} }>{ txt}</p>
						))}
					</div>
				</div>
			</div>
        </div>
	);
}
 
export default Summary;
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import { jobs } from "@/lib/common/common-job";

const Summary = (props: any) => {
	const isToday = true;
	// const [inputNumberValue, setInputNumberValue] = useState<number>(props.total || 0);
	const numberFormat = (num:number) =>{
		return new Intl.NumberFormat().format(num ?? 0);
	};
	const subSum = (num:number)=>{

	};

	return (
		<div className="flex w-[1000px] flex-wrap justify-between border-4 border-black">
			<div className="flex text-center">
				<div className="font-bold text-xl p-5 mr-3 border-r-2 border-gray-300">
					<p>자가덤프 {props.j}m<sup>3</sup> x {props.jdump} <label id="dumpTot-j">{ numberFormat(props.jtot) }</label>m<sup>3</sup></p>
					<p>외부덤프 {props.o}m<sup>3</sup> x {props.odump} <label id="dumpTot-o">{ numberFormat(props.otot) }</label>m<sup>3</sup></p>
					<p>로우더 	{props.r}m<sup>3</sup> x {props.rdump} <label id="dumpTot-r">{ numberFormat(props.rtot) }</label>m<sup>3</sup></p>
				</div>
				<div className="">
					<p className="font-bold text-xl pt-6">총 <label id="total" htmlFor="">{props.total}</label>m<sup>3</sup></p>
				</div>
			</div>
			<div className="flex border-l-2 border-gray-800">
				<div className="font-bold text-xl p-5 mr-3 border-r-2 border-gray-3">
					<p>석분덤프 	{props.j}m<sup>3</sup> x <label id="dumpTot-j">{ numberFormat(props.jtot) }</label>m<sup>3</sup></p>
					<p>석분로우더 	{props.o}m<sup>3</sup> x <label id="dumpTot-o">{ numberFormat(props.otot) }</label>m<sup>3</sup></p>
					<p>토사덤프 	{props.r}m<sup>3</sup> x <label id="dumpTot-r">{ numberFormat(props.rtot) }</label>m<sup>3</sup></p>
					<p>토사로우더 	{props.r}m<sup>3</sup> x <label id="dumpTot-r">{ numberFormat(props.rtot) }</label>m<sup>3</sup></p>
				</div>
				<div className="">
					<p className="font-bold text-xl pt-6">총 <label id="total" htmlFor="">{props.total}</label> m<sup>3</sup></p>
				</div>
			</div>
			<div className="flex">
				<div className="font-bold text-xl p-5">
					합계
					<p>11+53</p>
					<p><label htmlFor="">{numberFormat(props.total)}</label>m<sup>3</sup></p>
				</div>
			</div>
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
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import { jobs } from "@/lib/common/common-job";

const Summary = (props: any) => {
	
	return (
		<div className="summary border-4 border-black">
			<div className="col border-r-2 border-black">
				
			</div>
			<div className="col sum-col">
				<div className="border-none" style={{paddingTop:'70%'}}>합계</div>
				<div>정비 <br/>및 <br/>수리 내용</div>
			</div>
			<div className="col">
				<div className="sum-grid">
					<div className="font-bold text-xl p-5">
						<p>자가덤프 {props.j}m<sup>3</sup><label id="dumpTot-j">{ props.jtot }</label>m<sup>3</sup></p>
						<p>외부덤프 {props.o}m<sup>3</sup><label id="dumpTot-o">{ props.otot }</label>m<sup>3</sup></p>
						<p>로우더 	{props.r}m<sup>3</sup><label id="dumpTot-r">{ props.rtot }</label>m<sup>3</sup></p>
					</div>
					<div className="">
						<p className="font-bold text-xl pt-6">총 <label id="total" htmlFor="">{props.total}</label> m<sup>3</sup></p>
					</div>
				</div>
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
	);
}
 
export default Summary;
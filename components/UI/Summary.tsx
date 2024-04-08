import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";

const Summary = (props: any) => {
	// console.log('props:', props);
	const isToday = true;
	const [inputNumberValue, setInputNumberValue] = useState<number>(props.total || 0);
	return (
		<div className="summary border-4 border-black">
			<div className="col">
				
			</div>
			<div className="col sum-col">
				<div style={{paddingTop:'70%'}}>합계</div>
				<div>정비 <br/>및 <br/>수리내용</div>
			</div>
			<div className="col">
				<div className="sum-grid">
					<div className="font-bold text-xl p-5">
						<p>자가덤프 {props.j}m<sup>3</sup><label id="dumpTot-j">{ props.jtot }</label>m<sup>3</sup></p>
						<p>외부덤프 {props.o}m<sup>3</sup><label id="dumpTot-o">{ props.otot }</label>m<sup>3</sup></p>
						<p>로우더 	{props.r}m<sup>3</sup><label id="dumpTot-r">{ props.rtot }</label>m<sup>3</sup></p>
					</div>
					<div className="">
						{isToday ? 
							<p className="font-bold text-xl pt-6">총 <label id="total" htmlFor="">{props.total}</label> m<sup>3</sup></p>
							:
							<p className="font-bold text-xl pt-6">총
								<label id="total" htmlFor="">
									<InputNumber
										value={inputNumberValue}
										onValueChange={(e) =>
											setInputNumberValue(e.value ?? 0)
										}
										mode="decimal"
									/>
								</label>
								m<sup>3</sup>
							</p>
						}
					</div>
				</div>
				<div id="rep" style={{textAlign:'left',paddingLeft:'5%',minHeight:'80px'}} className="text-lg">
					{props.maintenance.split(',').map((txt: string, idx: number) => (
						<p key={idx} className="rep-list" onClick={evt => {
							const tgt = evt.target as HTMLElement;
    						tgt && tgt.remove();
						} }>{ txt}</p>
					))}
				</div>
			</div>
        </div>
	);
}
 
export default Summary;
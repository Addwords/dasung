'use client';

import { useRef, useState } from "react";
import OperatorModal from "../modals/operator-modal";

function setOperator(curOper:string, operNm:string){
	const operEle = document.getElementById(curOper) as HTMLElement;
	operEle.textContent = operNm;
}

const Table = () => {

	const [showModal, setModal] = useState(false);
	const [curOp,setOp] = useState('');

	const opNmRef = useRef<HTMLDivElement[]>([]);
	const addPpNmRef = (el:HTMLDivElement)=>{el&&opNmRef.current.push(el);};

	const man = Array(11).fill(''); //금일 투입인력명
	const jobTime = Array(14).fill(5);
	
	return (
		<>
		{showModal && <OperatorModal
			operator={(nm:string)=>{setOperator(curOp,nm)}}
			onHide={()=>setModal(false)}
		/>}
			<div className="wrapper border-4 border-black">
				<div className="col">
					<div className="min-h-14 text-center pt-1 border border-black">운전자 성명</div>
					{jobTime.map((val,idx) => (
						//수정가능해야함
						<div className="cursor-pointer" key={idx + 1} id={`op${val+idx}`}
							// ref={addPpNmRef}
							onClick={(evt)=>{
								console.log('opNmRef:',opNmRef);
								let cop = evt.target as HTMLElement;
								setOp(cop.id);
								setModal(true);
							}}
						></div>
					))}
				</div>
				<div className="col">
					<div className="min-h-14 text-center border border-black">시간</div>
					{jobTime.map((val,idx) => (
						<div key={idx} className="time-table">{val+idx}:00</div>
					))
					}
				</div>
				<div className="data-grid">
					{[...Array(40).fill(1)].map((v, i) => (
						// <div key={x+i} className="text-center border border-black min-h-7 bg-gray-800 text-white">{x+i}</div>
						<div key={i}>{v+i}</div>
					))}
					{
						jobTime.map((val,i) => (
							[...Array(40).fill(1)].map((x, idx) => (
								<div key={val+idx} id={`t${val+i}-${idx}`}></div>
							))
						))
					}
				</div>
				<div className="col">
					<div className="pt-1">자가덤프</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`j${val+idx}`} className=""></div>
						))
					}
				</div>
				<div className="col">
					<div className="pt-1">외부덤프</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`o${val+idx}`} className=""></div>
						))
					}
				</div>
				<div className="col">
					<div className="pt-3">로우더</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`r${val+idx}`} className=""></div>
						))
					}
				</div>
				<div className="col">
					<div className="pt-3 font-bold">계</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`tot${val+idx}`} className="font-bold"></div>
						))
					}
				</div>
			</div>
		</>
	);
}
 
export default Table;
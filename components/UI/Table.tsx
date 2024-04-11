'use client';

import { useRef, useState } from "react";
import OperatorModal from "../modals/operator-modal";
import { TableProps } from "@/types/type";
import axios from "axios";

async function setOperator(curOperId:string, operNm:string){
	const operEle = document.getElementById(curOperId) as HTMLElement;
	operEle.textContent = operNm;
	// axios
	await axios.post('/api/table', { servNm:'setOperator', jobId: curOperId, operator: operNm });
}

const Table = ({
	istoday,
	comcd,
	joblimit,
	jobList,
	operators
 }:TableProps) => {
	const [showModal, setModal] = useState(false);
	const [curOp, setOp] = useState('');
	const date = new Date();
	const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
	const opNmRef = useRef<HTMLDivElement[]>([]);
	// const addOpNmRef = (el:HTMLDivElement)=>{el&&opNmRef.current.push(el);};

	const jobTime = Array(joblimit > 14 ? joblimit : 14).fill(5); //작업기본시간 5~18시..늘려야하나?
	
	return (
		<>
			{showModal && <OperatorModal
			today={today}
			comcd={comcd}
			oplist={operators}
			setop={(nm:string)=>{setOperator(curOp,nm)}}
			onHide={()=>setModal(false)}
		/>}
			<div className="wrapper border-4 border-black">
				<div className="col">
					<div className="min-h-14 text-center pt-1 border border-black" style={{wordBreak: 'keep-all'}}>운전자 성명</div>
					{jobTime.map((val,idx) => (
						//수정가능해야함
						<div className="cursor-pointer" key={idx + 1} id={jobList[String(val+idx).padStart(2,'0')]?.id}
							onClick={(evt)=>{
								if(!istoday){
									return null;
								}
								let cop = evt.target as HTMLElement;
								setOp(cop.id);
								setModal(true);
							}}
						>
							{jobList[String(val+idx).padStart(2,'0')]?.name}
						</div>
					))}
				</div>
				<div className="col">
					<div className="min-h-14 text-center border border-black">시간</div>
					{jobTime.map((val,idx) => (
						<div key={idx} className="time-table">{String(val+idx).padStart(2,'0')}:00</div>
					))
					}
				</div>
				<div className="data-grid">
					{[...Array(40).fill(1)].map((v, i) => (
						// <div key={x+i} className="text-center border border-black min-h-7 bg-gray-800 text-white">{x+i}</div>
						<div key={i}>{v+i}</div>
					))}
					{
						jobTime.map((val, i) => (
							[...Array(40).fill(1)].map((x, idx) => (
								<div key={val + idx} id={`t${val + i}-${idx}`} className={jobList[String(val + i).padStart(2, '0')]?.dump[idx]}>
								{jobList[String(val + i).padStart(2, '0')]?.job[idx]}
								</div>
							))
						))
					}
				</div>
				<div className="col">
					<div className="pt-1">자가덤프</div>
					{jobTime.map((val, idx) => (
						<div key={val + idx} id={`jd${val + idx}`}>{jobList[String(val+idx).padStart(2,'0')]?.jtot}</div>
						))
					}
				</div>
				<div className="col">
					<div className="pt-1 od">외부덤프</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`od${val+idx}`}>{jobList[String(val+idx).padStart(2,'0')]?.otot}</div>
						))
					}
				</div>
				<div className="col">
					<div className="pt-3 rd" style={{wordBreak:'keep-all'}}>로우더</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`rd${val+idx}`}>{jobList[String(val+idx).padStart(2,'0')]?.rtot}</div>
						))
					}
				</div>
				<div className="col">
					<div className="pt-3 font-bold">계</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`tot${val+idx}`} className="font-bold">{jobList[String(val+idx).padStart(2,'0')]?.subtot}</div>
						))
					}
				</div>
			</div>
		</>
	);
}
 
export default Table;
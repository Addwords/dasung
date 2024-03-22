'use client';

import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const Table = () => {

	const cellRef = useRef([[]]);

	const man = Array(20).fill(''); //금일 투입인력명
	const jobTime = Array(20).fill(5);
	
	return (
		<>
			<div className="wrapper border-4 border-black">
				<div className="col">
					<div className="min-h-14 text-center border border-black">운전자 성명</div>
					{man.map((val,idx) => ( 
						//수정가능해야함
						<div className=" cursor-pointer" onClick={()=>{}} key={idx + 1}>{val}</div>
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
					<div className="">자가덤프</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`j${val+idx}`} className=""></div>
						))
					}
				</div>
				<div className="col">
					<div className="">외부덤프</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`o${val+idx}`} className=""></div>
						))
					}
				</div>
				<div className="col">
					<div className="">로우더</div>
					{jobTime.map((val,idx) => (
						<div key={val+idx} id={`r${val+idx}`} className=""></div>
						))
					}
				</div>
				<div className="col">
					<div className="font-bold">소계</div>
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
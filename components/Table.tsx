'use client';

import { useRef } from "react";

const Table = () => {

	const cellRef = useRef([[]]);

	const man = ['김영훈','방세헌','방세헌','유덕현','박종서','박종서','박종서','김영훈','유덕현','김영훈','유덕현','김영훈']; //금일 투입인력명
	const jobTime = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20,21,22,23,24];
	
	return (
		<div className="wrapper border-4 border-black ">
			<div className="col">
				<div className="min-h-14 text-center border border-black">오퍼레이터<br /></div>
				{man.map((val,idx) => ( 
					//수정가능해야함
					<div className=" cursor-pointer" onClick={()=>{}} key={idx + 1}>{val}</div>
				))}
			</div>
			<div className="col">
				<div className="min-h-14 text-center border border-black">시간</div>
				{jobTime.map((val,idx) => (
					<div key={val} className="">{val}:00</div>
				))
				}
			</div>
			<div className="data-grid">
				{[...Array(40).fill(1)].map((x, i) => (
					// <div key={x+i} className="text-center border border-black min-h-7 bg-gray-800 text-white">{x+i}</div>
					<div key={x+i}>{x+i}</div>
				))}
				{
					jobTime.map((val,i) => (
						[...Array(40).fill(1)].map((x, idx) => (
							<div key={x+idx} id={`t${val}-${idx}`}></div>
						))
					))
				}
			</div>
			<div className="col">
				<div className="">자가덤프</div>
				{jobTime.map((val,idx) => (
					<div key={val} id={`j${val}`} className=""></div>
					))
				}
			</div>
			<div className="col">
				<div className="">외부덤프</div>
				{jobTime.map((val,idx) => (
					<div key={val} id={`o${val}`} className=""></div>
					))
				}
			</div>
			<div className="col">
				<div className="">로우더</div>
				{jobTime.map((val,idx) => (
					<div key={val} id={`r${val}`} className=""></div>
					))
				}
			</div>
			<div className="col">
				<div className="font-bold">소계</div>
				{jobTime.map((val,idx) => (
					<div key={val} id={`tot${val}`} className="font-bold"></div>
					))
				}
			</div>
		</div>
	);
	console.log(cellRef);
}
 
export default Table;
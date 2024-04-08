'use client';

import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";

//운전자 생성
async function setOperator(nm:string,comCd:string) {
	const operObj: { [key: string]: string; } = {
		servNm: 'setOp',
		name:nm,
		comcd:comCd,
	  };
	// console.log('operObj:', operObj, props.today);
	try {
		await axios.put('/api/config', operObj)
	} catch (e) {
		console.error(e);
	}
	// window.location.replace(`/${comCd}/${props.today}`);
	// router.fa
	// location.reload();
	// router.push(`/${comCd}/${props.today}`)
};

//운전자 삭제
async function delOperator(id:string,comCd:string) {
	const operObj: { [key: string]: string; } = {
		servNm: 'delOp',
		operId:id
	  };
	// console.log('operObj:', operObj, props.today);
	try {
		await axios.delete('/api/config', {data: operObj})
	} catch (e) {
		console.error(e);
	}
	// window.location.replace(`/${comCd}/${props.today}`);
	// router.fa
	// location.reload();
	// router.push(`/${comCd}/${props.today}`)
};

const OperatorInfo = (props: any) => {

	/**
	 * 선언부
	 */
	const [operInfo, setOperInfo] = useState(props.obj);
	const getOperators = async () => { await axios.post('/api/table', { servNm: 'getOperator', comCd: props.comcd })
										.then(res => {
											setOperInfo(res.data);
										});
								}
	const setOpRef = useRef<HTMLInputElement>(null);

	return (
		<>
			{/* 반복부 */}
			{
			operInfo.map((obj:any,idx:number) => (
				<div className="col-12 lg:col-6 xl:col-3" key={idx}>
					<div className="card mb-0">
						<div className="flex justify-content-between mb-3">
							<div>
								<span className="block text-500 font-bold text-2xl pt-3">{obj.name}</span>
								{/* <div className="text-900 font-medium text-xl">{operInfo.jDump}m<sup>3</sup></div> */}
							</div>
							<Button icon="pi pi-times" rounded outlined severity="danger" onClick={() => {
								delOperator(obj.id, props.comcd).then(() => {
									getOperators();
								});
							}} />
							{/* <div className="flex align-items-center justify-content-center bg-gray-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
								<i className="pi pi-car text-black text-xl" />
							</div> */}
						</div>
						{/* <span className="text-green-500 font-medium">24 new </span>
						<span className="text-500">since last visit</span> */}
					</div>
				</div>
			))
			}
			<div className="col-12 lg:col-6 xl:col-3">
				<div className="card mb-0">
					<div className="flex justify-content-between">
						<InputText size={10} className="text-semibold text-2xl" type="text" placeholder="이름입력" ref={setOpRef}/>
						<Button icon="pi pi-plus" rounded outlined severity="info" onClick={() => {
							if (setOpRef.current!.value === '') {
								alert('이름을 입력해 주세요.');
								return;
							}
							setOperator(setOpRef.current!.value, props.comcd).then(() => {
								setOpRef.current!.value = '';
								getOperators();
							});
						}} />
					</div>
				</div>
			</div>
		</>
	);
}
 
export default OperatorInfo;
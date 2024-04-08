'use client';

import { postFetcher } from "@/lib/common-fetcher";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";

const DumpInfo = (props: any) => {

    const dumpInfo = props.obj;
    const [jdumpValue, setJdumpValue] = useState<number>(dumpInfo.jDump || 0); //내부덤프
    const [jchange, setJchange] = useState(false); //내부덤프
    const [odumpValue, setOdumpValue] = useState<number>(dumpInfo.oDump || 0); //외부덤프
    const [ochange, setOchange] = useState(false); //외부덤프
    const [rdumpValue, setRdumpValue] = useState<number>(dumpInfo.rDump || 0); //로우더
    const [rchange, setRchange] = useState(false); //로우더

	async function dumpModify(kind:string) {
		const dumpObj: { [key: string]: any; } = {
			servNm: 'setAsset',
			comCd:props.comcd
		}
		const key = kind == 'jd' ? 'jsize' : kind == 'od' ? 'osize' : 'rsize';
		const value = kind == 'jd' ? jdumpValue : kind == 'od' ? odumpValue : rdumpValue;
		dumpObj[key] = value;
		await postFetcher('/api/config', dumpObj)
			.then(res => {
				// console.log(res);
				if (res?.status === 200) {
					// kind == 'jd' ? setJchange(false) : kind == 'od' ? setOchange(false) : setRchange(false);
				}
			});

	}
    return (
        <>
            {/* 자가덤프, 외부덤프, 로우더 셋팅 */}
				<div className="col-12 lg:col-6 xl:col-3">
					<div className="card mb-0">
						<div className="flex justify-content-between mb-3">
							<div>
								<span className="block text-500 font-semibold mb-3">내부덤프</span>
								<div className="text-900 font-medium text-xl">
									<div className="p-inputgroup">
										<InputNumber
											inputClassName="font-semibold pt-2 pb-2 pr-1 text-xl"
											className="w-auto"
											size={2}
											value={jdumpValue}
											onValueChange={(e) => {
												setJdumpValue(e.value ?? 0)
												setJchange(true);
											}}
											mode="decimal"
										/>
										<p className="pl-1 pt-2">m<sup>3</sup></p>
										<Button className="ml-3 mt-2" style={{ height: '2.2rem' }} label="save" icon="pi pi-check"
										onClick={() => dumpModify('jd')}/>
									</div>
								</div>
							</div>
							<div className="flex align-items-center justify-content-center bg-gray-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
								<i className="pi pi-car text-black text-xl" />
							</div>
						</div>
						{/* <span className="text-green-500 font-medium">24 new </span>
						<span className="text-500">since last visit</span> */}
					</div>
				</div>
                {/*  */}
				<div className="col-12 lg:col-6 xl:col-3">
					<div className="card mb-0">
						<div className="flex justify-content-between mb-3">
							<div>
								<span className="block text-500 font-semibold mb-3">외부덤프</span>
								<div className="text-900 font-medium text-xl">
									<div className="p-inputgroup">
										<InputNumber
												inputClassName="font-semibold pt-2 pb-2 pr-1 text-xl"
												className="w-auto"
												size={2}
												value={odumpValue}
												onValueChange={(e) => {
													setOdumpValue(e.value ?? 0)
													setOchange(true);
												}}
												mode="decimal"
										/>
										<p className="pl-1 pt-2">
											m<sup>3</sup>
									</p>
									<Button className="ml-3 mt-2" style={{ height: '2.2rem' }} label="save" icon="pi pi-check"
										onClick={() => dumpModify('od')}/>
									</div>
								</div>
							</div>
							<div className="flex align-items-center justify-content-center bg-yellow-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
								<i className="pi pi-car text-yellow-500 text-xl" />
							</div>
						</div>
						{/* <span className="text-green-500 font-medium">%52+ </span>
						<span className="text-500">since last week</span> */}
					</div>
				</div>
                {/*  */}
				<div className="col-12 lg:col-6 xl:col-3">
					<div className="card mb-0">
						<div className="flex justify-content-between mb-3">
							<div>
								<span className="block text-500 font-semibold mb-3">로우더</span>
								<div className="text-900 font-medium text-xl">
									<div className="p-inputgroup">
										<InputNumber
												inputClassName="font-semibold pt-2 pb-2 pr-1 text-xl"
												className="w-auto"
												size={2}
												value={rdumpValue}
												onValueChange={(e) => {
													setRdumpValue(e.value ?? 0)
													setRchange(true);
												}}
												mode="decimal"
										/>
										<p className="pl-1 pt-2">
											m<sup>3</sup>
										</p>
										<Button className="ml-3 mt-2" style={{ height: '2.2rem' }} label="save" icon="pi pi-check"
										onClick={() => dumpModify('rd')}/>
								</div>
								</div>
							</div>
							<div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
								<i className="pi pi-car text-blue-500 text-xl" />
							</div>
						</div>
						{/* <span className="text-green-500 font-medium">520 </span>
						<span className="text-500">newly registered</span> */}
					</div>
				</div>
        </>
    );
}

export default DumpInfo;
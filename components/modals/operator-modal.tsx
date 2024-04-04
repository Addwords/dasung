'use client';

import axios from "axios";
import { useState } from "react";
import InputModal from "./input-modal";
import { SyncLoader } from "react-spinners";
import { useRouter } from "next/dist/client/components/navigation";

export default function OperatorModal(props: any) {
	
	const [showModal, setShowModal] = useState(false);
	const [comCd, setcomCd] = useState(props.comcd);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	
	//운전자 생성
	async function setOperator(nm:string) {
		const operObj: { [key: string]: string; } = {
			servNm: 'setOp',
			name:nm,
			comcd:comCd,
		  };
		// console.log('operObj:', operObj, props.today);
		await axios.put('/api/table', operObj)
		// window.location.replace(`/${comCd}/${props.today}`);
		// router.fa
		location.reload();
		// router.push(`/${comCd}/${props.today}`)
	};

  return (
	  <>
		  {loading && 
            <div className="backdrop-brightness-95 loadingwrap">
                <SyncLoader color="rgb(54, 215, 183)" size={20}/>
            </div>
          }
		  {showModal && <InputModal onHide={() => { setShowModal(false) }} onInput={(nm: string) => { setLoading(true); setOperator(nm);} } />}
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    운전자 선택
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => props.onHide()}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
				<div className="relative p-6 flex flex-wrap" style={{width: '50vh'}}>
					{/* 반복부 */}
					{props.oplist.map((obj:any, idx:number) => (
						<button
							key={idx}
							style={{flexBasis: '30%',flexGrow:0}}
							className="bg-indigo-900 text-white active:bg-indigo-950 font-bold uppercase text-lg px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							onClick={(evt) => {
								let opernm = evt.target as HTMLElement;
									props.setop(opernm.textContent);
									props.onHide();
								}}
							>
							{obj.name}
						</button>
					))
					}
						  <button className="bg-indigo-900 text-white active:bg-indigo-950 font-bold uppercase text-lg px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							  style={{flexBasis: '30%',flexGrow:0}}
						type="button" onClick={() => {
							setShowModal(true);
						}}>
						+
					</button>	  
						  
				</div>
                {/*footer*/}
				<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
					<button
					className="text-black background-transparent font-bold rounded uppercase px-6 py-2 text-sm outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:outline-indigo-700 "
					type="button"
					onClick={() => props.onHide()}
					>
					닫기
					</button>
					
				</div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
  );
}
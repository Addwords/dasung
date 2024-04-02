'use client';

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { SyncLoader } from "react-spinners";

// root location에 반응?
// console.log('when render?')
// const SetupPage = async (compCd:string) => {

//     const date = new Date();
//     const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
// 	const company = compCd;
//     // 현재는 오늘날짜 작업화면으로 이동
//     // 추후 회사선택 메인화면이나 대시보드 같은 메인화면으로 변경예정😁
//     return redirect(`/${company}/${today}`);
// }

const SelectPage = ()=>{
    
    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
    const [loading, setLoading] = useState(false);

return(
    <>
    {/* <button>(주)다성 용인지점</button> */}
    {/* <a href={`/001/${today}`}>(주)다성 용인지점</a> */}
        <div className="flex h-lvh justify-center" style={{alignItems:'center'}}>
            {loading && 
            <div className="absolute backdrop-brightness-95 loadingwrap">
                <SyncLoader color="rgb(54, 215, 183)" size={20}/>
            </div>
            }
            <div className="mb-32 grid gap-6 text-center lg:max-w-5xl lg:mb-0 lg:grid-cols-2 lg:text-left">
                <Link href={`/001/${today}`} onClick={()=>setLoading(true)}>
                    <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors
                    hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                    rel="noopener noreferrer">
                        <h2 className={`mb-3 text-2xl font-semibold`}>(주)다성 용인지점</h2>
                    </div>
                </Link>

                {/*  */}
                <a href={`/002/${today}`} onClick={()=>setLoading(true)}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>(주)다성 용인제2공장 지점</h2>
                </a>
                <a href={`/003/${today}`} onClick={()=>setLoading(true)}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>(주)다성레미콘</h2>
                </a>
                <a href={`/004/${today}`} onClick={()=>setLoading(true)}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>(주)청정개발</h2>
                </a>
                <a href={`/005/${today}`} onClick={()=>setLoading(true)}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>(주)청정개발지점</h2>
                </a>
            </div>
        </div>
    </>
)
}
export default SelectPage;
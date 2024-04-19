'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from "react";
import { SyncLoader } from "react-spinners";
import OtpInput, { AllowedInputTypes } from "react-otp-input";
import { postFetcher, putFetcher } from '@/lib/common-fetcher';
import Image from 'next/image';
import { Button } from 'primereact/button';
// root location에 반응?
// const SetupPage = async (compCd:string) => {

//     const date = new Date();
//     const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
// 	const company = compCd;
//     // 현재는 오늘날짜 작업화면으로 이동
//     // 추후 회사선택 메인화면이나 대시보드 같은 메인화면으로 변경예정😁
//     return redirect(`/${company}/${today}`);
// }

const SelectPage = () => {

    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const isMounted = useRef(false);
    const setMounted = (flag: boolean) => { isMounted.current = flag; }
    const [loading, setLoading] = useState(true);
    const [pwModal, setPwModal] = useState(false);
    const [password, setPassword] = useState('');
    const [comnm, setComNm] = useState('');
    const [compw, setCompw] = useState({ pw: '', location: '' });
    const [dasungInfo, setDasugnInfo] = useState([]);
    const [chungjuInfo, setChungjuInfo] = useState([]);
    const [invalid, setInvalid] = useState(false);
    useEffect(() => {
        // if (!isMounted.current) {
        postFetcher('/api/config', {
            servNm: 'getCompany',
        }).then(res => {
            let comp = res?.data;
            setDasugnInfo(comp.slice(0, 3));
            setChungjuInfo(comp.slice(-2));
            setLoading(false);
        });
        // };
        // return setMounted(true);
    }, []);
    const factoryInit = (year: string, comcd: string) => {
        putFetcher('/api/config', {
            servNm: 'summaryInit',
            year: year,
            comcd:comcd
        });
    }
    return (
        <>
            {/* <button>(주)다성 용인지점</button> */}
            {/* <a href={`/001/${today}`}>(주)다성 용인지점</a> */}
            {/* <div className='flex flex-col'>
                {chungjuInfo.length > 0 &&
                    chungjuInfo.map((obj: any, idx: number) => (
                        <Button key={idx} label={`${obj.comNm} 초기화`}
                            onClick={() => factoryInit('2024', obj.comCd)}
                        />
                    ))
                }
            </div> */}
            <div className="flex h-lvh justify-center" style={{ alignItems: 'center' }}>
                {loading &&
                    <div className="absolute backdrop-brightness-95 loadingwrap" style={{ zIndex: 1102 }}>
                        <SyncLoader color="rgb(54, 215, 183)" size={20} />
                    </div>
                }
                <Dialog
                    visible={pwModal}
                    style={{ width: 'auto' }}
                    modal
                    onHide={() => setPwModal(false)}
                    content={() => (
                        <>
                            <h2 className='text-2xl text-white ml-5'>{comnm}</h2>
                            <div className="flex flex-column px-8 py-5 gap-4 pwdialog"
                                style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                                <OtpInput
                                    value={password}
                                    inputType='password'
                                    onChange={(otp: string) => {
                                        setPassword(otp);
                                        if (otp.length > 3) {
                                            if (otp === compw['pw']) {
                                                setLoading(true);
                                                location.href = compw['location'];
                                            } else {
                                                //비밀번호 틀림처리
                                                // border-color:'#e24c4c';
                                                // .pwdialog input
                                                document.querySelectorAll('.pwdialog div input').forEach(el => {
                                                    el.className = 'invalid-border';
                                                });
                                                setPassword('');
                                            }
                                        }
                                    }}
                                    numInputs={4}
                                    inputStyle={{
                                        width: '5rem',
                                        height: '5rem',
                                        fontSize: '2rem',
                                        borderRadius: '1rem',
                                        caretColor: 'transparent'
                                    }}
                                    shouldAutoFocus={true}
                                    renderSeparator={<span>&nbsp;</span>}
                                    renderInput={(props) => (
                                        <input
                                            {...props}
                                            placeholder='*'
                                        />)}
                                />
                            </div>
                        </>
                    )}
                ></Dialog>
                {/* <div className="mb-32 grid gap-6 text-center lg:max-w-5xl lg:mb-0 lg:grid-cols-2 lg:text-left"> */}
                <div className='flex justify-between w-[700px]'>
                    {/* 다성 */}
                    <div className="flex flex-col items-center text-center lg:max-w-5xl lg:mb-0 lg:text-left">
                        <Image alt='다성' src={'/dasung_logo.png'} width={100} height={100} priority={true} className='mb-10' />
                        <div className='flex flex-col pl-5'>
                            {dasungInfo.length > 0 &&
                                dasungInfo.map((val: any, idx: number) => (
                                    <a key={idx}
                                        onClick={() => {
                                            setComNm(val.comNm);
                                            setPassword('');
                                            setCompw({ pw: val.password, location: `/${val.comCd}/${today}` });
                                            setPwModal(true);
                                        }}
                                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors mb-4
							hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                                        rel="noopener noreferrer">
                                        <h2 className={`mb-3 text-2xl font-semibold`}>{val.comNm}</h2>
                                    </a>
                                ))
                            }
                        </div>
                    </div>
                    {/* 청주 */}
                    <div className="flex flex-col items-center text-center lg:max-w-5xl lg:mb-0 lg:text-left">
                        <Image alt='다성' src={'/chungju_logo.png'} width={80} height={80} priority={true} className='mb-9' />
                        <div className='flex flex-col pl-5'>
                            {chungjuInfo.length > 0 &&
                                chungjuInfo.map((val: any, idx: number) => (
                                    <a key={idx}
                                        onClick={() => {
                                            setComNm(val.comNm);
                                            setPassword('');
                                            setCompw({ pw: val.password, location: `/${val.comCd}/${today}` });
                                            setPwModal(true);
                                        }}
                                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors mb-4
							hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                                        rel="noopener noreferrer">
                                        <h2 className={`mb-3 text-2xl font-semibold`}>{val.comNm}</h2>
                                    </a>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SelectPage;
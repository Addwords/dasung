'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import OtpInput, { AllowedInputTypes } from "react-otp-input";
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
    const [pwModal, setPwModal] = useState(false);
    const [password, setPassword] = useState('');
    const [comnm, setComNm] = useState('');
    const [compw, setCompw] = useState({ pw: '', location: '' });
    
return(
    <>
    {/* <button>(주)다성 용인지점</button> */}
    {/* <a href={`/001/${today}`}>(주)다성 용인지점</a> */}
        <div className="flex h-lvh justify-center" style={{alignItems:'center'}}>
            {loading && 
            <div className="absolute backdrop-brightness-95 loadingwrap" style={{zIndex:1102}}>
                <SyncLoader color="rgb(54, 215, 183)" size={20}/>
            </div>
            }
            <Dialog
                visible={pwModal}
                style={{width:'auto'}}
                modal
                onHide={() => setPwModal(false)}
                content={() => (
                    <>
                        <h2 className='text-2xl text-white ml-5'>{comnm}</h2>
                    <div className="flex flex-column px-8 py-5 gap-4 pwdialog"
                        style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <OtpInput
                            value={password}
                            onChange={(otp:string) => {
                                setPassword(otp);
                                if (otp.length > 3) {
                                    if (otp === compw['pw']) {
                                        setLoading(true);
                                        location.href = compw['location'];
                                    } else {
                                        //비밀번호 틀림처리
                                        // border-color:'#e24c4c';
                                        // .pwdialog input
                                    }
                                }
                            }}
                            numInputs={4}
                            inputStyle={{
                                width: '5rem',
                                height: '5rem',
                                fontSize: '2rem',
                                borderRadius:'1rem'
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
            <div className="mb-32 grid gap-6 text-center lg:max-w-5xl lg:mb-0 lg:grid-cols-2 lg:text-left">
                
                <a
                    onClick={() => {
                        setComNm('(주)다성용인지점');
                        setPassword('');
                        setCompw({pw:'1111',location:`/001/${today}`});
                        setPwModal(true);
                    }}
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors
                    hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                    rel="noopener noreferrer">
                        <h2 className={`mb-3 text-2xl font-semibold`}>(주)다성 용인지점</h2>
                    </a>
                {/*  */}
                <a
                    onClick={() => {
                        setComNm('(주)다성용인제2공장지점');
                        setPassword('');
                        setCompw({pw:'2222',location:`/002/${today}`});
                        setPwModal(true);
                    }}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>(주)다성 용인제2공장 지점</h2>
                </a>
                <a
                    onClick={() => {
                        setComNm('(주)다성레미콘');
                        setPassword('');
                        setCompw({pw:'3333',location:`/003/${today}`});
                        setPwModal(true);
                    }}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>(주)다성레미콘</h2>
                </a>
                {/*  */}
                <a
                    onClick={() => {
                        setComNm('(주)청정개발');
                        setPassword('');
                        setCompw({pw:'4444',location:`/004/${today}`});
                        setPwModal(true);
                    }}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>(주)청정개발</h2>
                </a>
                {/*  */}
                <a
                    onClick={() => {
                        setComNm('(주)청정개발지점');
                        setPassword('');
                        setCompw({pw:'5555',location:`/005/${today}`});
                        setPwModal(true);
                    }}
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
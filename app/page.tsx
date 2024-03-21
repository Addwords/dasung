'use client';

import Table from "@/components/Table";
import InputModal from "@/components/modals/input-modal";
import Image from "next/image";
import { useEffect, useState } from "react";

let jCount = 0;
let dumpCount = [...Array(40).fill('')];
let subTot = [];
let realHH = 6; //업무최초시간

function Dump(name: String, val: string) {
  
  const now = new Date();
  let HH = now.getHours();
  
  const 마감시간 = 17; //업무종료시간?

  if (HH > 마감시간 || jCount > 39) {
    alert('불가능 합니다.');
    return
  }

  let kind = name == '외부' ? 'o' : name == '로우더' ? 'r' : 'j'; //입력받은 차량종류

  let mertalIn = document.querySelector(`#t${HH}-${jCount}`) as HTMLElement; //현재시간+횟수에 해당하는 칸
  let dialogInput = String(val); //String(Math.ceil(Math.random() * 10)); //모달창 입력으로 변경예정

  if (!!mertalIn) {
    mertalIn.textContent = val;  //dialogInput;
    if (kind == 'o') {
      mertalIn.style.backgroundColor = '#ffff00'; //외부덤프
    }
    if (kind == 'r') {
      mertalIn.style.backgroundColor = '#00b0f0'; //로우더
    }
  }
  
  dumpCount[jCount] = kind;
  
  calculate(kind,String(HH));

  jCount++;
}

function calculate(kind:String, HH:String) {
  // console.log('dumpCount:', dumpCount);

  let dumpTot = dumpCount.filter(el => kind === el).length; //차량별 합계
  let subTot  = dumpCount.filter(el => new RegExp(/([j,r,o])/).test(el)).length; //시간별 합계

  let kCount = document.querySelector(`#${kind}${HH}`);
  kCount ? kCount.textContent = String(dumpTot) : 0;
  
  let totCal = document.querySelector(`#tot${HH}`);
  totCal ? totCal.textContent = String(subTot) : 0;
}

function modify() {

  --jCount;
  let HH = new Date().getHours();
  let mertalIn = document.querySelector(`#t${HH}-${jCount}`) as HTMLElement;

  if (!!mertalIn) {
    mertalIn.textContent = '';
    mertalIn.style.backgroundColor = ``;
    let kind = dumpCount.pop();
    calculate(kind, String(HH));
  }
}

function realTime() {
  const now = new Date();
  const [hours, minutes, seconds] = [now.getHours(), now.getMinutes(), now.getSeconds()];

  if (realHH < hours) { //변경되는 시간체크
    realHH = hours;
    //시간별 값 초기화
    jCount = 0;
    dumpCount = [];
    subTot = [];
  };

  return `${hours < 10 ? '0' + hours : hours}시 ${minutes < 10 ? '0' + minutes : minutes}분 ${seconds < 10 ? '0' + seconds : seconds}초`;
};

export default function Home() {
  
  const [showModal, setModal] = useState(false);
  const [tit, setTit] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    setInterval(() => {
      setTime(realTime);
    }, 100);
  },[]);


  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            현재시간:&nbsp;
            <code className="font-mono font-bold" id="time">{ time }</code>
          </p>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href=""
              rel="noopener noreferrer"
            >
              로고들어갈자리{" "}
              {/* <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={50}
                height={50}
                priority
              /> */}
            </a>
          </div>
        </div>
  
        <div className="relative flex place-items-center mt-7 mb-5">
          <Table/>
        </div>
        {
          showModal && <InputModal
            title={tit}
            onHide={() => { setModal(false); }}
            onInput={(val:string) => { setModal(false); Dump(tit,val); }}
          />
        }
        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
            rel="noopener noreferrer"
            onClick={() => { setTit('자가'); setModal(true);}}
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              자가덤프{" "}
            </h2>
            <p className="pl-5 text-2xl">16m<sup>3</sup></p>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              
            </p>
          </a>
  
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
            onClick={() => { setTit('외부'); setModal(true);}}
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              외부덤프{" "}
            </h2>
            <p className="pl-5 text-2xl">16m<sup>3</sup></p>
          </a>
  
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
            onClick={() => { setTit('로우더'); setModal(true);}}
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              로우더{" "}
            </h2>
            <p className="pl-5 text-2xl">7m<sup>3</sup></p>
          </a>
  
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
            rel="noopener noreferrer"
            onClick={modify}
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              수정{" "}
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
              (비밀번호)
            </p>
          </a>
          {/*  */}
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              고장{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            </p>
          </a>
  
          {/*  */}
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              청소{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            </p>
          </a>
          {/*  */}
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              원자재 불량{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            </p>
          </a>
          {/*  */}
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              대석파쇄{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

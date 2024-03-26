'use client';

import Button from "@/components/UI/Button";
import Summary from "@/components/UI/Summary";
import Table from "@/components/UI/Table";
import AlertModal from "@/components/modals/alert-modal";
import { useEffect, useState } from "react";

let jCount = 0;
let dumpCount = [''];
let subTot = [];
let realHH = 6; //업무최초시간

const yyyy = new Date().getFullYear();
const mm = new Date().getMonth() + 1;
const dd = new Date().getDate();

/**
 * 차량별 작업을 등록한다.
 * @param name: 차량종류
 * @returns 
 */
function Dump(kind: string) {

  const now = new Date();
  const HH = now.getHours();
  const MM = now.getMinutes();

  const 마감시간 = 23; //업무종료시간?

  if (HH > 마감시간 || jCount > 39) {
    alert('불가능 합니다.');
    return
  }

  let mertalIn = document.querySelector(`#t${HH}-${jCount}`) as HTMLElement; //현재시간+횟수에 해당하는 칸
  // let dialogInput = String(val); //String(Math.ceil(Math.random() * 10)); //모달창 입력으로 변경예정

  if (!!mertalIn) {
    mertalIn.textContent = `${MM}'`;  //dialogInput;
    if (kind == 'od') {
      mertalIn.style.backgroundColor = '#ffff00'; //외부덤프
    }
    if (kind == 'rd') {
      mertalIn.style.backgroundColor = '#00b0f0'; //로우더
    }
  }

  dumpCount[jCount] = kind;

  calculate(kind, String(HH));

  jCount++;
}


/**
    * 수정버튼
    * desc : 현재시간중 마지막 값을 취소한다.
    */
function modify() {
  --jCount;
  let HH = new Date().getHours();
  let mertalIn = document.getElementById(`t${HH}-${jCount}`) as HTMLElement;

  if (!!mertalIn) {
    mertalIn.textContent = '';
    mertalIn.style.backgroundColor = ``;
    let kind = dumpCount.pop() || '';
    calculate(kind, String(HH));
  }
}

/**
 * 작업이 수행될때마다 카운트증가와 계산을 시작한다.
 * @param kind : 차량종류
 * @param HH :현재시
 */
function calculate(kind: string, HH: string) {
  // console.log('dumpCount:', dumpCount);

  let dumpTot = dumpCount.filter(el => kind === el).length; //차량별 합계
  let subTot  = dumpCount.filter(el => new RegExp(/([jd,rd,od])/).test(el)).length; //시간별 합계

  let kCount = document.getElementById(`${kind}${HH}`);
  kCount ? kCount.textContent = String(dumpTot) : 0;

  let totCal = document.getElementById(`tot${HH}`);
  totCal ? totCal.textContent = String(subTot) : 0;

  let jdump:number = 0;
  let odump:number = 0;
  let rdump:number = 0;

  document.querySelectorAll('[id^=jd]').forEach((el)=>{
    jdump += Number(el.textContent);
  });
  document.querySelectorAll('[id^=od]').forEach((el)=>{
    odump += Number(el.textContent);
  });
  document.querySelectorAll('[id^=rd]').forEach((el)=>{
    rdump += Number(el.textContent);
  });

  let jtot = document.getElementById(`dumpTot-j`) as HTMLElement;
    jtot.textContent = ` x ${jdump} = ${jdump * 16}`;
  let otot = document.getElementById(`dumpTot-o`) as HTMLElement;
    otot.textContent = ` x ${odump} = ${odump * 16}`;
  let rtot = document.getElementById(`dumpTot-r`) as HTMLElement;
    rtot.textContent = ` x ${rdump} = ${rdump * 7}`;

  let todayTotal = document.getElementById(`total`) as HTMLElement;
    todayTotal.textContent = `${(jdump * 16) + (odump * 16) + (rdump * 7)}`;
}

function repair(res: string) {
  let HH = new Date().getHours();
  let MM = new Date().getMinutes();
  const rep = document.getElementById('rep') as HTMLElement;
  const appCh = document.createElement('p');
  appCh.className = 'rep-list';
  appCh.addEventListener('click', (evt) => {
    const tgt = evt.target as HTMLElement;
    tgt && tgt.remove();
  });
  appCh.textContent = `${HH}시 ${MM}분 ${res}`;
  rep.appendChild(appCh);
}

function realTime() {
  const now = new Date();
  const [hours, minutes, seconds] = [now.getHours(), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')];

  if (realHH < hours) { //변경되는 시간체크
    realHH = hours;
    //시간별 값 초기화
    jCount = 0;
    dumpCount = [];
    subTot = [];
  };

  return `${hours < 10 ? '0' + hours : hours}시 ${minutes}분 ${seconds}초`;
};

export default function Home() {

  const [showModal, setModal] = useState(false);
  const [tit, setTit] = useState('');
  const [time, setTime] = useState('');

  const btnNm = ['고장', '청소', '원자재 불량', '대석파쇄'];

  useEffect(() => {
    setInterval(() => {
      setTime(realTime);
    }, 100);
  }, []);

  const today = `${yyyy}년 ${mm}월 ${dd}일`;

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {/* 프린트시 보이는 영역 */}
        <div className="print">
          <p className="text-3xl">{today}</p>
        </div>
        {/* 화면에서만 보일영역 */}
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex non-print">
          <p className="fixed left-0 top-0 flex w-full justify-center 
                        border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
                        dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto
                        lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            <code className="font-mono font-bold" id="time">{today}&nbsp;&nbsp;{time}</code>
          </p>
          <p className="text-3xl">작업중🛠</p>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none non-print">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
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
            <a
              className="flex place-items-center gap-2 p-8 lg:p-0"
            >
              설정
            </a>
          </div>
        </div>

        <div className="relative flex place-items-center mt-7 mb-5">

          {/* <TableProvider /> */}
          <Table
          />
        </div>
        <Summary
          j={16}
          o={16}
          r={16}
        />
        {/* {
          showModal && <InputModal
            title={tit}
            onHide={() => { setModal(false); }}
            onInput={(val:string) => { setModal(false); Dump(tit,val); }}
          />
        } */}
        {
          showModal && <AlertModal
            // title={tit}
            onHide={() => { setModal(false); }}
            onInput={() => { setModal(false); modify(); }}
          />
        }
        <div className="mb-32 grid text-center lg:max-w-5xl lg:mb-0 lg:grid-cols-2 lg:text-left non-print btn-area">
          <Button
            text='자가덤프'
            subText='16m<sup>3</sup>'
            func={() => Dump('jd')}
          />
          <Button
            text='외부덤프'
            subText='16m<sup>3</sup>'
            func={() => Dump('od')}
          />
          <Button
            text='로우더'
            subText='7m<sup>3</sup>'
            func={() => Dump('rd')}
          />
          <Button
            text='수정'
            desc='(비밀번호)'
            func={() => {
              jCount > 0 ? setModal(true) : setModal(false)
            }}
          />
          {
            btnNm.map((val, idx) => (
              <Button
                key={val}
                text={val}
                func={() => repair(val)}
              />
            ))
          }
        </div>
      </main>
    </>
  );
}
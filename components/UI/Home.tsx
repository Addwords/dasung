'use client';

import Button from "@/components/UI/Button";
import { Button as PButton } from 'primereact/button';
import 'primeicons/primeicons.css';
import Summary from "@/components/UI/Summary";
import Table from "@/components/UI/Table";
import AlertModal from "@/components/modals/alert-modal";
import { jobProps, StringDictionary } from "@/types/type";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { JobCalendar } from "./JobCalendar";
import { useParams } from "next/navigation";
import ApprovalHeader from "./approval/header";
import { GridLoader } from "react-spinners";

let mount = false;
let jCount = 0;
let dumpCount = [''];
let subTot = [];
let realHH = 5; //업무최초시간
let summId = '';
let jobIds: { [key: string]: string } = {};
let jobArr: { [key: string]: string }[] = [];
let jsize: number, osize: number, rsize: number;
let opList: StringDictionary = {};

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

  const startT = 5; //업무종료시간?

  if (HH < startT || jCount > 39) {
    alert('불가능 합니다.');
    return
  }
  
  let mertalIn = document.querySelector(`#t${HH}-${jCount}`) as HTMLElement; //현재시간+횟수에 해당하는 칸

  if (!!mertalIn) {
    mertalIn.textContent = `${MM}'`;  //dialogInput;
    mertalIn.className = kind; //외부덤프
  }

  dumpCount[jCount] = kind;

  calculate(kind, String(HH), String(MM));

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
    calculate(kind, String(HH), '');
  }
}

function runnningTime() {
  let runTime = 0;
  let arr: number[] = []
  document.querySelectorAll('.col div[id^=tot]').forEach(el => {
    if (el.textContent != '0') {
      arr.push(Number(el.id.replace('tot', '')));
    }
  });
  runTime = (arr[arr.length-1] - arr[0]) + 1
  return runTime;
}
/**
 * 작업이 수행될때마다 카운트증가와 계산을 시작한다.
 * @param kind : 차량종류
 * @param HH :현재시
 */
async function calculate(kind: string, HH: string, MM: string) {

  let dumpTot = dumpCount.filter(el => kind === el).length; //차량별 합계
  let subTot = dumpCount.filter(el => new RegExp(/([jd,rd,od])/).test(el)).length; //시간별 합계

  let kCount = document.getElementById(`${kind}${HH}`);
  kCount ? kCount.textContent = String(dumpTot) : 0;

  let totCal = document.getElementById(`tot${HH}`);
  totCal ? totCal.textContent = String(subTot) : 0;
  
  let jdump: number = 0;
  let odump: number = 0;
  let rdump: number = 0;

  //자가덤프 총합
  document.querySelectorAll('[id^=jd]').forEach((el) => {
    jdump += Number(el.textContent);
  });
  //외부덤프 총합
  document.querySelectorAll('[id^=od]').forEach((el) => {
    odump += Number(el.textContent);
  });
  //로우더 총합
  document.querySelectorAll('[id^=rd]').forEach((el) => {
    rdump += Number(el.textContent);
  });

  let jtot = document.getElementById(`dumpTot-j`) as HTMLElement;
  jtot.textContent = ` x ${jdump} = ${jdump * jsize}`;
  let otot = document.getElementById(`dumpTot-o`) as HTMLElement;
  otot.textContent = ` x ${odump} = ${odump * osize}`;
  let rtot = document.getElementById(`dumpTot-r`) as HTMLElement;
  rtot.textContent = ` x ${rdump} = ${rdump * rsize}`;

  let todayTotal = document.getElementById(`total`) as HTMLElement;
  todayTotal.textContent = `${(jdump * jsize) + (odump * osize) + (rdump * rsize)}`;

  MM ? jobArr.push({ [MM + `'`]: kind }) : jobArr.pop();
  const jobObj: { [key: string]: any; } = {
    servNm: 'setJob',
    jobId: jobIds[HH.padStart(2, '0')],
    job: jobArr,
    subtot: subTot
  };

  jobObj[kind == 'jd' ? 'jtot' : kind == 'od' ? 'otot' : 'rtot'] = dumpTot;
  await axios.post('/api/table', jobObj);
  //갱신
  const summObj = {
    servNm: 'setSummary',
    summId: summId,
    jsize: jsize,
    jtot: jdump,
    osize: osize,
    otot: odump,
    rsize: rsize,
    rtot: rdump,
    jobtime: runnningTime(),
    tot: (jdump * jsize) + (odump * osize) + (rdump * rsize),
  }
  await axios.post('/api/table', summObj);
}

async function repair(res: string) {
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

  let maintenance: string[] = [];
  Array.from(rep.children).map((el, idx) => {
    maintenance.push(el.textContent || '');
  })

  const repObj = {
    servNm: 'setRepair',
    summId: summId,
    maintenance: maintenance.join(',')
  }
  await axios.post('/api/table', repObj);

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
    jobArr = [];
  };

  return `${hours < 10 ? '0' + hours : hours}:${minutes}:${seconds}`;
};

export default function Home({
  date,
  company,
  operators,
  jobList,
  summInfo,
  dumpInfo
}: {
  date: string;
  company: { [key: string]: string };
  operators: any;
  jobList: jobProps[];
  summInfo: any;
  dumpInfo: any;
}) {
  const [loading,setLoading] = useState(true);
  const isMounted = useRef(false);
  const setMount = (flag:boolean)=>{isMounted.current = flag}
  const [showModal, setModal] = useState(false);
  const [calen, setCalen] = useState(false);
  const [time, setTime] = useState('');
  const btnRef = useRef<HTMLAnchorElement[]>([]);

  const today = `${date.substring(0, 4)}년${date.substring(4, 6)}월${date.substring(6, 8)}일`;
  const calDate = `${date.substring(0, 4)}.${date.substring(4, 6)}.${date.substring(6, 8)}`;
  const isToday = new Date().toDateString() === new Date(calDate).toDateString();
  const jobprint = () => {
    console.log(navigator.userAgent);
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      alert('PC환경에서만 가능합니다.');
    } else {
      window.print();
    }
  }
  //단축키 bind
  const shortcutFunc: { [key: string]: () => void } = {
    'F1': () => { btnRef.current[0]?.click(); },
    'F2': () => { btnRef.current[1]?.click(); },
    'F3': () => { btnRef.current[2]?.click(); },
    'F4': () => { btnRef.current[3]?.click(); },
    'F5': () => { btnRef.current[4]?.click(); },
    'F6': () => { btnRef.current[5]?.click(); },
    'F7': () => { btnRef.current[6]?.click(); },
    'F8': () => { btnRef.current[7]?.click(); },
  };
  useEffect(()=>{
    // 차량용량
    if (isToday) {
      jsize = dumpInfo.jDump;
      osize = dumpInfo.oDump;
      rsize = dumpInfo.rDump;
    } else {
      jsize = summInfo.jsize;
      osize = summInfo.osize;
      rsize = summInfo.rsize;
    }
    setLoading(false);
  },[]);
  // handle what happens on key press
  const handleKeyPress = useCallback((event: any) => {
    if (event.key == 'Escape') { //모달 닫기
      setModal(false);
    }
    if (event.key == 'Enter') { //수정하기
      document.getElementById('modi')?.click();
    }
    if (shortcutFunc[event.key]) {
      event.preventDefault();
      shortcutFunc[event.key]();
    };
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const btnList = [
    { txt: '자가덤프', subTxt: `${jsize}m<sup>3</sup>`, color: '', func: () => { Dump('jd') } },
    { txt: '자가덤프', subTxt: `${osize}m<sup>3</sup>`, color: '#ffd900', func: () => {Dump('od')} },
    { txt: '자가덤프', subTxt: `${rsize}m<sup>3</sup>`, color: '#00b0f0', func: () => {Dump('rd')} },
    { txt: '수정', subTxt: '', color: '', func: () => {jCount > 0 ? setModal(true) : setModal(false) } },

    { txt: '고장', subTxt: '', color: '', func: () => repair('고장') },
    { txt: '청소', subTxt: '', color: '', func: () => repair('청소') },
    { txt: '원자재 불량', subTxt: '', color: '', func: () => repair('원자재 불량') },
    { txt: '대석파쇄', subTxt: '', color: '', func: () => repair('대석파쇄') },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(realTime);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  function madeJob(obj: any) {
    if (obj.job.length === 0) {
      return { job: [], dump: [] };
    }

    return {
      job: obj.job.map((val: any) => {
        return Object.keys(val)
      })
        .reduce((pre: [], cur: []) => {
          return pre.concat(cur);
        }),
      dump: obj.job.map((val: any) => {
        return Object.values(val)
      })
        .reduce((pre: [], cur: []) => {
          return pre.concat(cur);
        }),
    }
  }
  useEffect(()=>{
    if (!isMounted.current) {
      //등록된 작업자 목록
      jobList.map((obj: {
        time: string, id: string,
        operator: string, job: any,
        jTot: number, oTot: number, rTot: number,
        subTot: number
      }) => {
        opList[obj.time] = {
          id: obj.id,
          name: obj.operator,
          ...madeJob(obj),
          jtot: obj.jTot,
          otot: obj.oTot,
          rtot: obj.rTot,
          subtot: obj.subTot,
        };
        jobIds[obj.time] = obj.id
      });
      const curHour = new Date().getHours();
      const curObj = opList[String(curHour).padStart(2, '0')];
        if (curObj) {
          jCount = curObj.subtot;
          dumpCount = curObj.dump;
          curObj.job.forEach((val: string, idx: number) => {
            jobArr.push({ [val]: curObj.dump[idx] })
          });
        }
      realHH = curHour; //init
      summId = summInfo.id; //업데이트용
    }
    return setMount(true);
  },[]);

  return (
    <>
      {loading &&
          <div className="absolute backdrop-brightness-95 loadingwrap" style={{ zIndex: 1102 }}>
              <GridLoader color="rgb(103 123 220)" size={20} />
          </div>
      }
      <main className="flex min-h-screen flex-col items-center pad:ml-10 justify-between print-top 3xl:p-24 lg:p-12 mb-24">
        {/* 프린트시 보이는 영역 */}
        <div className="print flex justify-between w-full max-w-6xl">
          <div className="grid">
            <div className="flex text-2xl">원석투입정보 &nbsp;<div className="text-lg">{company.nm}</div></div>
            <p className="text-base font-mono">{today}</p>
          </div>
          <ApprovalHeader/>
        </div>
        {/* 화면에서만 보일영역 */}
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex non-print">
          {/* fixed left-0 top-0 */}
          <p className="flex w-full justify-center 
                        border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
                        dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto
                        lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 lg:flex">
            <code className="clock" id="time">{time}</code>
          </p>
          <div className="flex">
            <p className="text-3xl" style={{ wordBreak: 'keep-all' }}>{today}</p>
            <Image src="/eraser.svg" alt="" className="cursor-pointer ml-2" width={30} height={25} onClick={() => { setCalen(!calen) }} />
          </div>
          <div className="relative">
            {calen && <JobCalendar
              comcd={company.cd}
              date={calDate}
              onHide={() => { setCalen(false) }}
            />}
          </div>
          {/* fixed bottom-0 left-0 */}
          <div className="block w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black 
          lg:static lg:h-auto lg:w-auto lg:bg-none non-print">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 text-2xl font-semibold sm:p-0"
              rel="noopener noreferrer"
            >
              {company.nm}
            </a>
            <div className="flex justify-end">
              <PButton label="인쇄" severity="secondary" text onClick={jobprint}>
                <i className="pi pi-print ml-2"></i>
              </PButton>
            </div>
          </div>
        </div>

        <div className="relative flex place-items-center mt-7 mb-5">
          {/* <TableProvider /> */}
          <Table
            istoday={isToday}
            comcd={company.cd}
            operators={operators}
            joblimit={jobList.length}
            jobList={opList}
          />
        </div>

        <div className="relative flex place-items-center mt-7 mb-5">
          {(jsize && osize && rsize) && <Summary
            istoday={isToday}
            j={jsize}
            o={osize}
            r={rsize}
            jtot={` x ${summInfo.jdump} = ${jsize * summInfo.jdump}`}
            otot={` x ${summInfo.odump} = ${osize * summInfo.odump}`}
            rtot={` x ${summInfo.rdump} = ${rsize * summInfo.rdump}`}
            total={(jsize * summInfo.jdump) + (osize * summInfo.odump) + (rsize * summInfo.rdump)}
            maintenance={summInfo.maintenance}
          />}
        </div>
        {
          showModal && <AlertModal
            // title={tit}
            onHide={() => { setModal(false); }}
            onInput={() => { setModal(false); modify(); }}
          />
        }
        {isToday && //오늘만 가능함
          <div className="mr-2 grid text-center lg:max-w-5xl lg:mb-0 grid-cols-4 non-print btn-area">
            {(jsize && osize && rsize) &&
              btnList.map((obj, idx) => (
                <Button
                  key={idx}
                  text={obj.txt}
                  subText={obj.subTxt}
                  color={obj.color}
                  btnRef={(el: any) => { btnRef.current.push(el); }}
                  func={() => obj.func() }
                />
              ))
            }
          </div>}
      </main>
    </>
  );
}
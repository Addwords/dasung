'use client';

import Button from "@/components/UI/Button";
import Summary from "@/components/UI/Summary";
import Table from "@/components/UI/Table";
import AlertModal from "@/components/modals/alert-modal";
import { jobProps, StringDictionary } from "@/types/type";
import axios from "axios";
import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";

let mount = false;
let jCount = 0;
let dumpCount = [''];
let subTot = [];
let realHH = 5; //업무최초시간
let summId = '';
let jobIds: {[key:string]:string} = {};
let job: { [key: string]: string }[] = [];
let jsize: number, osize: number, rsize: number;
let opList:StringDictionary = {};

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
  console.log(mertalIn);

  if (!!mertalIn) {
    mertalIn.textContent = `${MM}'`;  //dialogInput;
    mertalIn.className = kind; //외부덤프
  }

  dumpCount[jCount] = kind;
  console.log('dumpCount', dumpCount);

  calculate(kind, String(HH),String(MM));

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
    calculate(kind, String(HH),'');
  }
}

/**
 * 작업이 수행될때마다 카운트증가와 계산을 시작한다.
 * @param kind : 차량종류
 * @param HH :현재시
 */
async function calculate(kind: string, HH: string, MM:string) {
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

  //자가덤프 총합
  document.querySelectorAll('[id^=jd]').forEach((el)=>{
    jdump += Number(el.textContent);
  });
  //외부덤프 총합
  document.querySelectorAll('[id^=od]').forEach((el)=>{
    odump += Number(el.textContent);
  });
  //로우더 총합
  document.querySelectorAll('[id^=rd]').forEach((el)=>{
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
  
  console.log(job)
  MM ? job.push({ [MM+`'`]: kind }) : job.pop();
  const jobObj:{ [key: string]: any; } = {
    servNm: 'setJob',
    jobId: jobIds[HH],
    job: job.reduce((pre, cur) => {
      return Object.assign(pre, cur); //job
    }),
    subtot:subTot
  }
  console.log(jobObj);
  jobObj[kind == 'jd' ? 'jtot' : kind == 'od' ? 'otot' : 'rtot'] = dumpTot;
  await axios.post('/api/table', jobObj);
  //갱신
  const summObj = {
    servNm: 'setSummary',
    summId: summId,
    jtot: jdump,
    otot: odump,
    rtot: rdump,
    tot: (jdump * jsize) + (odump * osize) + (rdump * rsize),
  }
  await axios.post('/api/table', summObj);
  // dumpCount

  // console.log('test:', test);
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
  
  let maintenance:string[] = [];
  Array.from(rep.children).map((el, idx) => {
    maintenance.push(el.textContent||'');
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
    job = [];
  };

  return `${hours < 10 ? '0' + hours : hours}:${minutes}:${seconds}`;
};

export default function Home ({
  company,
  jobList,
  summInfo,
  dumpInfo
}: {company:string,jobList:jobProps[], summInfo:any, dumpInfo:any}){

  const [isMounted, setMount] = useState(false);
  const [showModal, setModal] = useState(false);
  const [time, setTime] = useState('');
  const btnRef = useRef<HTMLAnchorElement[]>([]);

  //단축키 bind
  const shortcutFunc:{[key:string]:()=>void} = {
    'F1':()=>{btnRef.current[0].click();},
    'F2':()=>{btnRef.current[1].click();},
    'F3':()=>{btnRef.current[2].click();},
    'F4':()=>{btnRef.current[3].click();},
    'F5':()=>{btnRef.current[4].click();},
    'F6':()=>{btnRef.current[5].click();},
    'F7':()=>{btnRef.current[6].click();},
    'F8':()=>{btnRef.current[7].click();},
  };

  // handle what happens on key press
  const handleKeyPress = useCallback((event: any) => {
    // console.log(`Key pressed: ${event.key}`);
    if(event.key == 'Escape'){ //모달 닫기
      setModal(false);
    }
    if(event.key == 'Enter'){ //수정하기
      document.getElementById('modi')?.click();
    }
    if(shortcutFunc[event.key]){
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

  const btnNm = ['고장', '청소', '원자재 불량', '대석파쇄'];

  useEffect(() => {
    setMount(true);
    const intervalId = setInterval(() => {
      setTime(realTime);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);
  
  if (!isMounted) { //mount once
      return null;
  }
  
  if(!mount){
    mount = true;
    // 차량용량
    jsize = dumpInfo.jd;
    osize = dumpInfo.od;
    rsize = dumpInfo.rd;
    //등록된 작업자 목록
    jobList.map((obj: {
      time: string, id: string,
      operator: string, job: any,
      jTot: number, oTot: number, rTot: number,
      subTot:number
    }) => {
      opList[obj.time] = {
        id: obj.id,
        name: obj.operator,
        job: Object.keys(obj.job),
        dump:Object.values(obj.job),
        jtot:obj.jTot,
        otot:obj.oTot,
        rtot:obj.rTot,
        subtot:obj.subTot,
      };
      jobIds[obj.time] = obj.id
    });
    const curObj = opList[String(new Date().getHours()).padStart(2, '0')];
    setTimeout(() => { //SSR, CSR 이렇게 두번 rendering되면서 전역변수가 초기화 되는데 타이밍을 못찾겠음.
      if(curObj){
        jCount = curObj.subtot;
        dumpCount = curObj.dump;
        curObj.job.forEach((val:string,idx:number)=>{
          job.push({[val]:curObj.dump[idx]})
        });
      }
    }, 1000);
    summId = summInfo.id; //업데이트용
  }
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
            <code className="clock" id="time">{time}</code>
          </p>
          <p className="text-3xl">{today}</p>
          <p className="text-3xl">달력 들어올곳</p>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none non-print">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 text-2xl"
              rel="noopener noreferrer"
            >
              {company}
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

          {/* <TableProvider /> */}
          <Table
            joblimit={jobList.length}
            opLists={opList}
          />
        </div>
        <Summary
          j={jsize}
          o={osize}
          r={rsize}
          jtot={` x ${summInfo.jdump} = ${jsize * summInfo.jdump}`}
          otot={` x ${summInfo.odump} = ${osize * summInfo.odump}`}
          rtot={` x ${summInfo.rdump} = ${rsize * summInfo.rdump}`}
          total={(jsize * summInfo.jdump) + (osize * summInfo.odump) + (rsize * summInfo.rdump)}
          maintenance={summInfo.maintenance}
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
        <div style={{
          position:'fixed',
          marginLeft:'5%',
          left: '0',
          backgroundColor: 'white'
        }}>
          패치내용
          <p>운전자명 저장가능</p>
          <p>단축키 F1~F8</p>
        </div>
        <div className="mb-32 grid text-center lg:max-w-5xl lg:mb-0 lg:grid-cols-2 lg:text-left non-print btn-area">
          <Button
            text='자가덤프'
            subText={`${jsize}m<sup>3</sup>`}
            // ref={(el:JSX.Element)=>btnRef.current.push(el)}
            // btnRef={(el:any)=>{btnRef.current.push(el)}}
            btnRef={(el:any)=>{btnRef.current[0] = el;}}
            func={() => Dump('jd')}
          />
          <Button
            text='외부덤프'
            subText={`${osize}m<sup>3</sup>`}
            btnRef={(el:any)=>{btnRef.current[1] = el;}}
            func={() => Dump('od')}
          />
          <Button
            text='로우더'
            subText={`${rsize}m<sup>3</sup>`}
            btnRef={(el:any)=>{btnRef.current[2] = el;}}
            func={() => Dump('rd')}
          />
          <Button
            text='수정'
            desc=''
            btnRef={(el:any)=>{btnRef.current[3] = el;}}
            func={() => {
              jCount > 0 ? setModal(true) : setModal(false)
            }}
          />
          {
            btnNm.map((val, idx) => (
              <Button
                key={val}
                text={val}
                btnRef={(el:any)=>{btnRef.current[idx+4] = el;}}
                func={() => repair(val)}
              />
            ))
          }
        </div>
      </main>
    </>
  );
}
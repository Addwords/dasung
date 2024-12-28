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
import { jobs } from "@/lib/common/common-job";
import Summary2 from "./Summary2";

// let mount = false;
// let subTot = [];
let realHH = 5; //업무최초시간
// const yyyy = new Date().getFullYear();
// const mm = new Date().getMonth() + 1;
// const dd = new Date().getDate();

function realTime() {
  const now = new Date();
  const [hours, minutes, seconds] = [now.getHours(), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')];

  if (realHH < hours) { //변경되는 시간체크
    realHH = hours;
    //시간별 값 초기화
    jobs.setJCount(0);
    jobs.setDumpCount([]);
    // subTot = [];
    jobs.setJobArr([]);
    jobs.setMatArr([]);
  };

  return `${hours < 10 ? '0' + hours : hours}:${minutes}:${seconds}`;
};

//시작😀
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

  const [jsize, setJsize] = useState(0);
  const [osize, setOsize] = useState(0);
  const [rsize, setRsize] = useState(0);
  const [pdsize, setPdsize] = useState(0);
  const [plsize, setPlsize] = useState(0);
  const [sdsize, setSdsize] = useState(0);
  const [slsize, setSlsize] = useState(0);

  const [opList,setOpList] = useState({}); 
  // 
  const testparam = useParams();
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

  /**
   * 
   * @param vehicle : 차량분류 
   * @param materials : 원자재종류
   */
  const jobExec = (vehicle:string, materials:string) => {
    jobs.dump(vehicle, materials);
  }

  useEffect(()=>{
    // 차량용량
    const today_jSize = isToday ? dumpInfo.jDump : summInfo.jsize;
    const today_oSize = isToday ? dumpInfo.oDump : summInfo.osize
    const today_rSize = isToday ? dumpInfo.rDump : summInfo.rsize;
    const today_pdSize = isToday ? dumpInfo.powderDump : summInfo.pdsize;
    const today_plSize = isToday ? dumpInfo.powderLoader : summInfo.plsize;
    const today_sdSize = isToday ? dumpInfo.sedimentDump : summInfo.sdsize;
    const today_slSize = isToday ? dumpInfo.sedimentLoader : summInfo.slsize;
    setJsize(today_jSize);
    setOsize(today_oSize);
    setRsize(today_rSize);
    setPdsize(today_pdSize);
    setPlsize(today_plSize);
    setSdsize(today_sdSize);
    setSlsize(today_slSize);

    jobs.setVehicle({volInternal: today_jSize, volExternal: today_oSize, volLoader: today_rSize}); //작업차량 용량 셋팅
  },[]);

  /**
   * 단축키 설정
   */
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
    { txt: '외부덤프', subTxt: `${osize}m<sup>3</sup>`, color: '#ffd900', func: () => {Dump('od')} },
    { txt: '로우더',   subTxt: `${rsize}m<sup>3</sup>`, color: '#00b0f0', func: () => {Dump('rd')} },
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
      return { job: [], dump: [], material:[] };
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
      let tmpJobIds: { [key: string]: string } 	= {}; // 작업
      let tmpOpList: StringDictionary = {};
      //등록된 작업자 목록
      jobList.map((obj: {
        time: string, id: string,
        operator: string, job: any, material:any,
        jTot: number, oTot: number, rTot: number,
        subTot: number
      }) => {
        tmpOpList[obj.time] = {
          id: obj.id,
          name: obj.operator,
          ...madeJob(obj),
          mat: obj.material,
          jtot: obj.jTot,
          otot: obj.oTot,
          rtot: obj.rTot,
          subtot: obj.subTot,
        };
        tmpJobIds[obj.time] = obj.id
      });
      // console.log('tmpOpList:',tmpOpList);
      setOpList(tmpOpList);
      jobs.setJobIds(tmpJobIds);

      const curHour = new Date().getHours();
      const curObj = tmpOpList[String(curHour).padStart(2, '0')];
        if (curObj) {
          jobs.setJCount(curObj.subtot);
          jobs.setDumpCount(curObj.dump);
          let tmpArr: { [x: string]: any; }[] = [];
          curObj.job.forEach((val: string, idx: number) => {
            tmpArr.push({ [val]: curObj.dump[idx] })
          });
          jobs.setJobArr(tmpArr);
          jobs.setMatArr(curObj.mat);
        }
      realHH = curHour; //init
      // console.log('summInfo.id::::',summInfo.id);
      jobs.setSummId(summInfo.id); //업데이트용
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
          {(jsize && osize && rsize) && 
          company.cd == '102' ?
          <Summary2
            istoday={isToday}
            j={jsize}
            o={osize}
            r={rsize}
            pd={pdsize}
            pl={plsize}
            sd={sdsize}
            sl={slsize}
            jdump={summInfo.jdump}
            odump={summInfo.odump}
            rdump={summInfo.rdump}
            ploader={summInfo.powderLoader}
            pdump={summInfo.powderDump}
            sloader={summInfo.sedimentLoader}
            sdump={summInfo.sedimentDump}
            total={
              ((jsize * summInfo.jdump) + (osize * summInfo.odump) + (rsize * summInfo.rdump))
              + ((pdsize * summInfo.powderDump) + (plsize * summInfo.powderLoader) + (sdsize * summInfo.sedimentDump) + (slsize * summInfo.sedimentLoader))
            }
            maintenance={summInfo.maintenance}
          />
          :
          <Summary
            istoday={isToday}
            j={jsize}
            o={osize}
            r={rsize}
            jtot={` x ${summInfo.jdump} = ${jsize * summInfo.jdump}`}
            otot={` x ${summInfo.odump} = ${osize * summInfo.odump}`}
            rtot={` x ${summInfo.rdump} = ${rsize * summInfo.rdump}`}
            total={(jsize * summInfo.jdump) + (osize * summInfo.odump) + (rsize * summInfo.rdump)}
            maintenance={summInfo.maintenance}
          />
          }
        </div>
        {
          showModal && <AlertModal
            // title={tit}
            onHide={() => { setModal(false); }}
            onInput={() => { setModal(false); jobs.modify(); }}
          />
        }
        {isToday && //오늘만 가능함
        <>
          <div className="mb-32 grid text-center lg:max-w-5xl lg:mb-0 lg:grid-cols-1 lg:text-left non-print btn-area">
            {jsize && <Button
              text='자가덤프'
              subText={`${jsize}m<sup>3</sup>`}
              btnRef={(el: any) => { btnRef.current[0] = el; }}
              func={() => jobExec('jd', 'jd')}
            />}
            {osize && <Button
              text='외부덤프'
              subText={`${osize}m<sup>3</sup>`}
              color={'#ffd900'}
              btnRef={(el: any) => { btnRef.current[1] = el; }}
              func={() => jobExec('od','od')}
            />}
            {rsize && <Button
              text='로우더'
              subText={`${rsize}m<sup>3</sup>`}
              color={'#00b0f0'}
              btnRef={(el: any) => { btnRef.current[2] = el; }}
              func={() => jobExec('rd','rd')}
            />}
            
            <Button
              text='수정'
              desc=''
              btnRef={(el: any) => { btnRef.current[3] = el; }}
              func={() => {
                jobs.getJCount() > 0 ? setModal(true) : setModal(false)
              }}
            />
            {
              btnNm.map((val, idx) => (
                <Button
                  key={val}
                  text={val}
                  // btnRef={(el: any) => { btnRef.current[idx + 4] = el; }}
                  func={() => jobs.repair(val)}
                />
              ))
            }
          </div>
          {/* // 24.12.08 추가요구사항 */}
          <div className="mb-32 grid text-center lg:max-w-5xl lg:mb-0 lg:grid-cols-1 lg:text-left non-print btn-area-left">
            {company.cd == '102' && plsize && <Button
              text='석분(로더)'
              subText={`${plsize}m<sup>3</sup>`}
              color={'#b0b2b1'}
              btnRef={(el: any) => { btnRef.current[4] = el; }}
              func={() => jobExec('rd','limestone-powder')}
            />}
            {company.cd == '102' && pdsize && <Button
              text='석분(덤프)'
              subText={`${pdsize}m<sup>3</sup>`}
              color={'#b0b2b1'}
              btnRef={(el: any) => { btnRef.current[5] = el; }}
              func={() => jobExec('jd','limestone-powder')}
            />}
            {company.cd == '102' && slsize && <Button
              text='토사(로더)'
              subText={`${slsize}m<sup>3</sup>`}
              color={'#5acc8d'}
              btnRef={(el: any) => { btnRef.current[6] = el; }}
              func={() => jobExec('rd','sediment')}
            />}
            {company.cd == '102' && sdsize &&
              <Button
              text='토사(덤프)'
              subText={`${sdsize}m<sup>3</sup>`}
              color={'#5acc8d'}
              btnRef={(el: any) => { btnRef.current[7] = el; }}
              func={() => jobExec('jd','sediment')}
            />}
          </div>
        </>
        }
      </main>
    </>
  );
}
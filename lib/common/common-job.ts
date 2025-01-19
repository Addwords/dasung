import { Vehicle } from "@/types/type";
import axios from "axios";

export const jobs = (()=>{
	
	let _dumpCount 	= ['']; // 차량합계
	let _subDumpCount 	= ['']; // 추가차량합계
	let _jCount 	= 0; 	// 시간별 작업수량
	let _summId 	= '';	// 종합
	let subKind = '';
	let _jobArr: { [key: string]: string }[] = []; // 작업배열
	let _matArr: string[] = []; // 원자재배열
	let _jobIds: { [key: string]: string } 	 = {}; // 작업적용할 DB아이디
	let _vehicle: Vehicle;
	let _dumpJob: { [key: string]: number } = {};

	/**
	* 차량별 작업을 등록한다.
	* @param name: 차량종류
	* @returns 
	*/
    const _dump = (kind: string, materials: string, callback:Function) => {
		const now = new Date();
		const HH = now.getHours();
		const MM = now.getMinutes();
	
		const startT = 5; //업무시작시간?
	
		if (HH < startT || _jCount > 39) {
			alert('불가능 합니다.');
			return
		}
		
		let currentOperator = document.querySelector(`.oper-${String(HH).padStart(2,'0')}`)?.textContent;
		if(currentOperator == '')
			alert('운전자를 선택해주세요.');
		
		let mertalIn = document.querySelector(`#t${HH}-${_jCount}`) as HTMLElement; //현재시간+횟수에 해당하는 칸
	
		if (!!mertalIn) {
			mertalIn.textContent = `${MM}'`;  //dialogInput;
			mertalIn.className = materials; //외부덤프
		}
	
		_dumpCount[_jCount] = kind;
		switch(kind) {
			case 'jd':
				if (materials === 'limestone-powder') {
					subKind = 'pd';
				}else if(materials === 'sediment'){
					subKind = 'sd';
				}
				break;
			case 'rd':
				if (materials === 'limestone-powder') {
					subKind = 'pl';
				}else if(materials === 'sediment'){
					subKind = 'sl';
				}
				break;
			default: subKind = '';
		}
		_subDumpCount[_jCount] = subKind;
		console.log('_dumpCount::',_dumpCount);
		console.log('_subDumpCount::',_subDumpCount);
		_calculate(kind, subKind, String(HH), String(MM),callback);
	
		_jCount++;
    };

	/**
   * 작업이 수행될때마다 카운트증가와 계산을 시작한다.
   * @param kind : 차량종류
   * @param HH :현재시
   */
	const _calculate = (kind: string, materials: string, HH: string, MM: string, callback:Function) => {

		let dumpTot = _dumpCount.filter(el => kind === el).length; //차량별 합계
		let subDumpTot = _subDumpCount.filter(el => el === materials).length; //추가차량별 합계

		let subTot  = _dumpCount.filter(el => new RegExp(/([jd,rd,od])/).test(el)).length; //시간별 합계

		let kCount = document.getElementById(`${kind}${HH}`);
			kCount ? kCount.textContent = String(dumpTot) : 0;

		let sCount = document.getElementById(`${materials}${HH}`);
			sCount ? sCount.textContent = String(subDumpTot) : 0;

		let totCal = document.getElementById(`tot${HH}`);
		totCal ? totCal.textContent = String(subTot) : 0;
		
		let jdump: number = 0;
		let odump: number = 0;
		let rdump: number = 0;
		let powderLoader: number = 0;
		let powderDump: number = 0;
		let sedimentLoader: number = 0;
		let sedimentDump: number = 0;

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
		////
		//석분덤프 총합
		document.querySelectorAll('[id^=pl], [id^=pd], [id^=sl], [id^=sd]').forEach((el) => {
			if(el.id.includes('pl')) powderLoader += Number(el.textContent);
			if(el.id.includes('pd')) powderDump += Number(el.textContent);
			if(el.id.includes('sl')) sedimentLoader += Number(el.textContent);
			if(el.id.includes('sd')) sedimentDump += Number(el.textContent);
		});

		console.log(jdump, odump, rdump);
		console.log(powderLoader, powderDump, sedimentLoader, sedimentDump);
		_setDumpJob({
			jdump 	: jdump, 
			odump 	: odump,
			rdump 	: rdump,
			ploader : powderLoader,
			pdump 	: powderDump,
			sloader : sedimentLoader,
			sdump 	: sedimentDump 
		});
		callback && callback(_getDumpJob());
		// console.log(_vehicle);
		// _monitoring(jdump, odump, rdump);

		MM ? _jobArr.push({ [MM + `'`]: kind }) : _jobArr.pop();
		MM ? _matArr.push(materials) : _matArr.pop();
		const jobObj: { [key: string]: any; } = {
			servNm: 'setJob',
			jobId: _jobIds[HH.padStart(2, '0')],
			job: _jobArr,
			material: _matArr,
			subtot: subTot
		};
		
		jobObj[kind == 'jd' ? 'jtot' : kind == 'od' ? 'otot' : 'rtot'] = dumpTot;
		// jobObj[subKind == 'pl' ? 'pltot' : subKind == 'pd' ? 'pdtot' : subKind == 'sl' ? 'sltot' : 'sdtot'] = subDumpTot;
		switch(subKind){
			case 'pl': jobObj['pltot'] = subDumpTot; break;
			case 'pd': jobObj['pdtot'] = subDumpTot; break;
			case 'sl': jobObj['sltot'] = subDumpTot; break;
			case 'sd': jobObj['sdtot'] = subDumpTot; break;
		}
		jobObj
		axios.post('/api/table', jobObj);

		//갱신
		const summObj = {
			servNm: 'setSummary',
			summId: _summId,
			jsize: _vehicle['volInternal'],
			osize: _vehicle['volExternal'],
			rsize: _vehicle['volLoader'],
			jtot: jdump,
			otot: odump,
			rtot: rdump,
			pltot: powderLoader,
			pdtot: powderDump,
			sltot: sedimentLoader,
			sdtot: sedimentDump,
			jobtime: _runnningTime(),
			tot: (jdump * _vehicle['volInternal']) + (odump * _vehicle['volExternal']) + (rdump * _vehicle['volLoader']),
			// tot: ((jdump - powderDump) * _vehicle['volInternal']) + (odump * _vehicle['volExternal']) + (rdump * _vehicle['volLoader']),
			subtot: (powderLoader * _vehicle['volPowderLoader']) + (powderDump * _vehicle['volPowderDump']) + (sedimentLoader * _vehicle['volSedimentLoader']) + (sedimentDump * _vehicle['volSedimentDump']),
		}
		axios.post('/api/table', summObj);
	};

	/**
	 * 합계
	 * @param jdump 내부덤프
	 * @param odump 외부덤프
	 * @param rdump 로우더
	 */
	const _monitoring = (jdump:number,odump:number,rdump:number)=>{
		//
		let jtot = document.getElementById(`dumpTot-j`) as HTMLElement;
			jtot.textContent = ` x ${jdump} = ${jdump * _vehicle['volInternal']}`;
		let otot = document.getElementById(`dumpTot-o`) as HTMLElement;
			otot.textContent = ` x ${odump} = ${odump * _vehicle['volExternal']}`;
		let rtot = document.getElementById(`dumpTot-r`) as HTMLElement;
			rtot.textContent = ` x ${rdump} = ${rdump * _vehicle['volLoader']}`;

		let todayTotal = document.getElementById(`total`) as HTMLElement;
		todayTotal.textContent = `${(jdump * _vehicle['volInternal']) + (odump * _vehicle['volExternal']) + (rdump * _vehicle['volLoader'])}`;
		//
	};

	/**
	 * 수정버튼
	 * desc : 현재시간중 마지막 값을 취소한다.
	 */
	const _modify = (callback:Function) => {
		--_jCount;
		let HH = new Date().getHours();
		let mertalIn = document.getElementById(`t${HH}-${_jCount}`) as HTMLElement;

		if (!!mertalIn) {
			mertalIn.textContent = '';
			mertalIn.style.backgroundColor = ``;
			let kind = _dumpCount.pop() || '';
			let materials = _subDumpCount.pop() || '';
			console.log('%c 수정>>>>','background-color:orange',kind, materials);
			_calculate(kind, materials, String(HH), '', callback);
		}
	};

	const _runnningTime = () => {
		let runTime = 0;
		let arr: number[] = []
		document.querySelectorAll('.col div[id^=tot]').forEach(el => {
			if(el.textContent != '0') {
				arr.push(Number(el.id.replace('tot', '')));
			}
		});
		if(arr.length > 0)
			runTime = (arr[arr.length-1] - arr[0]) + 1
		console.log('runTime::',runTime);
		return runTime ?? 0;
	};

	/**
	 * 정비 및 수리내용
	 * @param res 
	 */
	const _repair = (res: string) => {
		let HH = new Date().getHours();
		let MM = new Date().getMinutes();
		const rep = document.getElementById('rep') as HTMLElement;
		const appCh = document.createElement('p');
		appCh.className = 'rep-list';
		appCh.textContent = `${HH}시 ${MM}분 ${res}`;
		appCh.addEventListener('click', (evt) => {
			const tgt = evt.target as HTMLElement;
			tgt && tgt.remove();
			_updateMaintenance(rep); //내역갱신
		});

		rep.appendChild(appCh);
		
		_updateMaintenance(rep);
	};
	
	/**
	 * 정비 및 수리내용 반영
	 * @param rep 
	 */
	const _updateMaintenance = (rep: HTMLElement)=>{
		let maintenance: string[] = [];
		Array.from(rep.children).map((el, idx) => {
			maintenance.push(el.textContent || '');
		});
		const repObj = {
			servNm: 'setRepair',
			summId: jobs.getSummId(),
			maintenance: maintenance.join(',')
		}

		axios.post('/api/table', repObj);
	};
	
	/**
	 * VO
	 * @param 
	 */
	const _setJcount = (num:number=0)=>{
		_jCount = num;
	};

	const _getJcount = ()=>{
		return _jCount;
	};

	const _setDumpCount = (dump:[])=>{
		_dumpCount = dump;
	};

	const _getDumpCount = ()=>{
		return _dumpCount;
	};

	const _setSubDumpCount = (dump:[])=>{
		_subDumpCount = dump;
	};

	const _getSubDumpCount = ()=>{
		return _subDumpCount;
	};

	const _setJobArr = (jobs:{[key: string]: string}[]  )=>{
		_jobArr = jobs;
	};

	const _getJobArr = ()=>{
		return _jobArr;
	};

	const _setMatArr = (mats: string[])=>{
		_matArr = mats;
	};

	const _getMatArr = ()=>{
		return _matArr;
	};

	const _setJobIds = (jobId:{ [key: string]: string })=>{
		_jobIds = jobId;
	};

	const _getJobIds = ()=>{
		return _jobIds;
	};

	const _setSummId = (summId:string)=>{
		_summId = summId;
	};

	const _getSummId = ()=>{
		return _summId;
	};

	const _setVehicle = (todayVec:Vehicle)=>{
		console.log('',todayVec);
		_vehicle = todayVec;
	};

	const _setDumpJob = (dumpJob:{ [key: string]: number })=>{
		_dumpJob = dumpJob;
	};

	const _getDumpJob = ()=>{
		return _dumpJob;
	};

	return{
		 dump : _dump
		,modify : _modify
		,calculate : _calculate
		,repair : _repair
		,setJCount : _setJcount
		,getJCount : _getJcount
		,setDumpCount : _setDumpCount
		,getDumpCount : _getDumpCount
		,setSubDumpCount : _setSubDumpCount
		,getSubDumpCount : _getSubDumpCount
		,setJobArr : _setJobArr
		,getJobArr : _getJobArr
		,setMatArr : _setMatArr
		,getMatArr : _getMatArr
		,setJobIds : _setJobIds
		,getJobIds : _getJobIds
		,setSummId : _setSummId
		,getSummId : _getSummId
		,setVehicle : _setVehicle
		,setDumpJob : _setDumpJob
		,getDumpJob : _getDumpJob
		,updateMaintenance : _updateMaintenance
	}
})();
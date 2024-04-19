
import { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableCellSelection, DataTableDataSelectableEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions, ColumnEvent } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { postFetcher } from '@/lib/common-fetcher';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
interface Sale {
	[key: string]: any
}

export default function AnalyTable(props: any) {

	const yearArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const tempObj: { [key: string]: number } = {};
	const dataSet: { [key: string]: any } = props?.data;
	const baseM = new Date().getMonth() + 1;
	const baseD = new Date().getDate();
	const [modifyDialog, setModifyDialog] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [modTit, setTit] = useState('');
	const [modDate, setDate] = useState('');
	const [modVal, setVal] = useState<number | null>(null);
	const [selectedCell, setSelectedCell] = useState<DataTableCellSelection<Sale[]> | null>(null);
	const [analy, setAnaly] = useState<Sale[]>([]);

	const isMounted = useRef(false);
	const analPrint = () => {
		if (/Android|iPhone/i.test(navigator.userAgent)) {
			alert('PC환경에서만 가능합니다.');
		} else {
			window.print();
		}
	}
	useEffect(() => {
		// const tableArr:Sale[] = [];
		if (dataSet && !isMounted.current) {
			yearArr.map(val => {
				tempObj[`${val}Time`]  = 0;
				tempObj[`${val}Cubic`] = 0;
			});

			const initArr: { [key: string]: string }[] = [...Array(31)].map((val, idx) => {
				return { date: `${idx + 1}일`, ...tempObj }
			});
			
			yearArr.map((mon, idx) => {
				if (dataSet[mon]?.length > 0) {
					dataSet[mon].map((obj: any, idx: number) => {
						initArr[idx][`${mon}Time`] = obj.jobtime;
						initArr[idx][`${mon}Cubic`] = obj.total;
					})
				}
				setAnaly(initArr)
			})
		}
		return () => { isMounted.current = true;}
	}, []);

	const colTotal = (key: string) => {
		let total = 0;

		for (let mon of analy) {
			total += parseInt(mon[key]);
		}

		return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const cubicTotal = () => {
		let cubic = 0;
		for (let mon of yearArr) {
			let total = 0;
			for (let m of analy) {
				total += parseInt(m[`${mon}Cubic`]);
			}
			cubic += total;
		}
		return `${cubic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m`;
	};

	const hideDialog = () => {
		setSubmitted(false);
		setModifyDialog(false);
	};

	const saveProduct = () => {
		setSubmitted(true);
		if (modVal || modVal === 0) {
			let [m, d] = modDate.split('.');
			let summId = dataSet[yearArr[Number(m) - 1]][Number(d) - 1].id;
			let servObj: { [key: string]: any } = {
				servNm: 'setSummary',
				summId: summId
			};
			servObj[modTit.includes('시간') ? 'jobtime' : 'tot'] = modVal;
			if (selectedCell) {
				let cell = selectedCell;
				cell.rowData[`${yearArr[Number(m) - 1]}${modTit.includes('시간') ? 'Time' : 'Cubic'}`] = modVal;
			}
			postFetcher('/api/config', servObj).then(() => {
				props.setMount(false);
				props.genKey(Math.random());
			});
			setModifyDialog(false);

		}
	};
	//내보내기
	const exportExcel = () => {
		const workbook = XLSX.utils.book_new();
		const timesheet = XLSX.utils.json_to_sheet(convertObjectInArr(analy, 'Time'));
		timesheet['!cols'] = [{}]
		const cubicsheet = XLSX.utils.json_to_sheet(convertObjectInArr(analy,'Cubic'));
		XLSX.utils.book_append_sheet(workbook, cubicsheet, `생산수량`);
		XLSX.utils.book_append_sheet(workbook, timesheet,  `생산시간`);
		XLSX.writeFile(workbook, `다성_${props.year}.xlsx`);
    };
	const convertObjectInArr = (param: Sale[], sep:string) => {
		const newArr = param.map((row) => {
			let newObj: {[key:string]: number} = {};
			newObj['일자'] = row['date'];
			yearArr.map((mon, idx) => {
				newObj[`${idx + 1}월`] = row[`${mon}${sep}`];
			});
			return newObj;
		});
		return newArr;
	};

	const modifyDialogFooter = (
		<>
			<Button label="취소" icon="pi pi-times" text onClick={hideDialog} />
			<Button label="저장" icon="pi pi-check" text onClick={saveProduct} />
		</>
	);

	const headerGroup = (
		<ColumnGroup>
			<Row>
				<Column header="" rowSpan={3} style={{ borderRight: '1px solid' }} />
				<Column header={`${props.year}년 생산현황`} alignHeader={'center'} colSpan={24} />
			</Row>
			<Row>
				{
					[...Array(12).fill(1)].map((val, idx) => (
						<Column key={idx}
							alignHeader={'center'}
							header={`${val + idx}월`}
							colSpan={2}
							style={idx < 11 ? { borderRight: '1px solid' } : {}}
							headerStyle={{ fontSize: '1rem', padding: '0.5rem' }}
							headerClassName='analy-month'
						/>
					))
				}
			</Row>
			<Row>
				{
					yearArr.map((val) => (
						[{ head: '생산 시간', field: 'Time' }, { head: '생산 수량', field: 'Cubic' }].map((wrap) => (
							<Column key={val + wrap.field}
								style={{
									fontSize: '0.8rem',
									borderRight: val == 'Dec' && wrap.field == 'Cubic' ? '' : '1px solid'
								}}
								header={wrap.head}
								alignHeader={'center'}
								headerStyle={{ wordBreak: 'keep-all', padding: '0.5rem' }}
								headerClassName='analy-header'
								field={`${val}${wrap.field}`}
							/>
						))
					))
				}
				{/* {
                    yearArr.map((val,idx) => (
                    ))
                } */}
			</Row>
		</ColumnGroup>
	);
	///
	///
	const footerGroup = (
		<ColumnGroup>
			<Row>
				<Column footer="합계"
					style={{ borderRight: '1px solid', height: '5%' }}
					footerStyle={{ textAlign: 'center' }}
				/>
				{yearArr.map((val) => (
					['Time', 'Cubic'].map((wrap, idx) => (
						<Column key={val + wrap}
							footer={colTotal(`${val}${wrap}`)}
							footerClassName='text-sm'
							footerStyle={{ textAlign: 'center' }}
							style={{
								borderRight: val == 'Dec' && wrap == 'Cubic' ? '' : '1px solid',
								backgroundColor: idx ? 'rgb(231 233 236 / 75%)' : 'rgb(248 250 252)'
							}}
						/>
					))
				))}
			</Row>
			<Row>
				<Column footer="생산량"
					style={{borderRight:'1px solid'}}
					footerStyle={{ textAlign: 'center' }}
				/>
				<Column
					footer={cubicTotal()}
					footerClassName='cubicTot'
					colSpan={24}
				/>
			</Row>
		</ColumnGroup>
	);

	const isSelectable = (data: any) => {
		let cell = data.data;
		let day = cell.rowIndex + 1; //선택일
		let mon = Math.ceil(cell.cellIndex / 2); //선택월
		return (baseM > mon || (baseM == mon && baseD > day)) && cell.cellIndex > 0 ? true : false;
	};

	const isCellSelectable = (event: DataTableDataSelectableEvent) => isSelectable(event);

	return (
		<div className="card nav">
			<div className="flex justify-end non-print">
			<Button type="button" icon="pi pi-file-excel" severity="success" label='엑셀' text onClick={exportExcel} data-pr-tooltip="XLS" />
              <Button type='button' icon='pi pi-print' severity="secondary" label='인쇄' text onClick={analPrint} />
			{/* <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={ } data-pr-tooltip="PDF" /> */}
            </div>
			<DataTable value={analy} headerColumnGroup={headerGroup} footerColumnGroup={footerGroup}
				tableStyle={{ width: '1500px' }} size='small'
				tableClassName='analysis-table'
				cellSelection selectionMode="single" selection={selectedCell!}
				isDataSelectable={isCellSelectable}
				onSelectionChange={(e) => {
					const cell = e.value ?? selectedCell;
					setSelectedCell(cell);
					let day = cell.rowIndex + 1; //선택일
					let mon = Math.ceil(cell.cellIndex / 2); //선택월
					let isTime = cell.cellIndex % 2; //생산시간 or 생산수량
					let value = cell.value;

					setModifyDialog(true);
					setTit(`${mon}월${day}일 ${isTime ? '생산시간' : '생산수량'}`);
					setDate(`${mon}.${day}`);
					setVal(value);
				}}
			>
				<Column field="date"
					style={{ borderRight: '1px solid', width: '100px' }}
					bodyStyle={{ textAlign: 'center' }}
					bodyClassName={'font-bold date-col'}
				/>
				{yearArr.map((val,i) => (
					['Time', 'Cubic'].map((wrap) => (
						<Column
							key={val + wrap}
							field={`${val}${wrap}`}
							style={val == 'Dec' && wrap == 'Cubic' ? {} : { borderRight: '1px solid' }}
							bodyClassName={cn('hover:bg-gray-200 text-sm analy-col')}
							bodyStyle={{ textAlign: 'center', padding: '0.5rem', width: '65px' }}
						/>
					))
				))}
			</DataTable>
			<Dialog visible={modifyDialog} style={{ width: '450px' }} header={modTit} modal className="p-fluid" footer={modifyDialogFooter} onHide={hideDialog}>
				<div className="field">
					<label htmlFor="name">수정</label>
					<InputNumber
						value={modVal}
						min={0}
						onValueChange={(e) =>
							setVal(e.value ?? null)
						}
						required
						autoFocus
						mode="decimal"
						inputStyle={{
							borderColor: submitted && modVal == null ? '#e24c4c' : ''
						}}
					// className={classNames({
					//     'p-invalid': submitted && modVal == null
					// })}
					/>
					{submitted && modVal == null && <small className="p-invalid" style={{ color: '#e24c4c' }}>필수값입니다.</small>}
				</div>
			</Dialog>
		</div>
	);
}
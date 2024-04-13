
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

interface Sale {
    [key: string]: any
}
let isMounted = false;
const yearArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export default function AnalyTable(props: any) {

    const tempObj: {[key:string]:string} = {};
	const baseM = new Date().getMonth()+1;
	const baseD = new Date().getDate();
	const [yearCubic, setCubic] = useState(0);
    yearArr.map(val => {
		tempObj.dat = '';
        tempObj[`${val}Time`]  = '0';
        tempObj[`${val}Cubic`] = '0';
    });
    const initArr:{[key:string]:string}[] = [...Array(31)].map((val, idx) => {
        return { ...tempObj, date: `${idx+1}일` }
    })
    const [analy, setAnaly] = useState<Sale[]>(initArr);
	const [selectedCell, setSelectedCell] = useState(null);

    useEffect(() => {
		// const tableArr:Sale[] = [];
		// console.log(props?.data)
		const data = props?.data;
		if(data && !isMounted){
			isMounted=true;
			yearArr.map((mon, idx) => {
				if(data[mon]?.length > 0){
					console.log(mon,'start');
					data[mon].map((obj:any,idx:number)=>{
						initArr[idx][`${mon}Time`] = obj.jobtime;
						initArr[idx][`${mon}Cubic`] = obj.total;
					})
				}
				setAnaly(initArr)
			})
		}
    }, []);
	
    const colTotal = (key: string) => {
        let total = 0;

        for (let sale of analy) {
            total += parseInt(sale[key]);
        }

        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

	const cubicTotal = ()=>{
		let cubic = 0;
		for(let mon of yearArr){
			let total = 0;
			for (let sale of analy) {
				total += parseInt(sale[`${mon}Cubic`]);
			}
			cubic += total;
		}
		return `${cubic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}m`;
	};
	const dataFormat = (str:string)=>{
		return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	// const exportPdf = () => {
    //     import('jspdf').then((jsPDF) => {
    //         import('jspdf-autotable').then(() => {
    //             const doc = new jsPDF.default(0, 0);

    //             doc.autoTable(exportColumns, products);
    //             doc.save('products.pdf');
    //         });
    //     });
    // };

    // const exportExcel = () => {
    //     import('xlsx').then((xlsx) => {
    //         const worksheet = xlsx.utils.json_to_sheet(products);
    //         const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    //         const excelBuffer = xlsx.write(workbook, {
    //             bookType: 'xlsx',
    //             type: 'array'
    //         });

    //         saveAsExcelFile(excelBuffer, 'products');
    //     });
    // };

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
                            headerStyle={{ fontSize: '1rem',padding:'0.5rem'}}
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
									borderRight: val == 'Dec' && wrap.field == 'Cubic' ? '':'1px solid'
									}}
                                header={wrap.head}
								alignHeader={'center'}
                                headerStyle={{ wordBreak: 'keep-all',padding:'0.5rem' }}
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

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="합계"
                    style={{ borderRight: '1px solid', height: '5%' }}
					footerStyle={{textAlign:'center'}}
                />
                {yearArr.map((val) => (
                    ['Time', 'Cubic'].map((wrap) => (
                        <Column key={val + wrap}
                            footer={colTotal(`${val}${wrap}`)}
                            footerStyle={{ textAlign: 'center' }}
                            style={val == 'Dec' && wrap == 'Cubic' ? {} : { borderRight: '1px solid' }}
                        />
                    ))
                ))}
            </Row>
			<Row>
				<Column footer="년 생산량"
					footerStyle={{textAlign:'center'}}
				/>
				<Column
					footer={cubicTotal()}
					footerClassName='cubicTot'
					colSpan={24}
				/>
			</Row>
        </ColumnGroup>
    );
	
    return (
        <div className="card">
			{/* <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
			<Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" /> */}
            <DataTable value={analy}
                headerColumnGroup={headerGroup}
                footerColumnGroup={footerGroup}
                tableStyle={{ width: '1400px' }}
				showGridlines
				stripedRows
				size='small'
				// scrollable
				// scrollHeight="700px" 
				cellSelection 
				selectionMode="single"
				selection={selectedCell}
				onSelectionChange={(e) => {
					// console.log(e.value);
					const cell = e.value;
					let day = cell.rowIndex + 1; //선택일
					let mon = Math.ceil(cell.cellIndex / 2); //선택월
					let isTime = cell.cellIndex % 2; //생산시간 or 생산수량
					let value = cell.value;
					//금일 이전 기록만 수정가능
					if(baseM <= mon && baseD <= day){
						console.log(`${mon}월${day}일 불가`);
					}else{
						console.log(`${mon}월${day}일 ${isTime?'생산시간':'생산수량'}:${value}`);
					}
					// setSelectedCell(e.value)
				}}
            >
                <Column field="date"
                    style={{ borderRight: '1px solid', width: '8%' }}
                    bodyStyle={{ textAlign: 'center' }}
                    bodyClassName={'font-bold'}
                />
                {yearArr.map((val) => (
                    ['Time', 'Cubic'].map((wrap) => (
                        <Column
						key={val + wrap} 
						field={`${val}${wrap}`}
						style={val == 'Dec' && wrap == 'Cubic' ? {} :{ borderRight: '1px solid' }}
						bodyStyle={{ textAlign: 'center', padding:'0.5rem', width:'70px' }}
						 />
                    ))
                ))}
            </DataTable>
        </div>
    );
}
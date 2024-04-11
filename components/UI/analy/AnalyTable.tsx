
import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

interface Sale {
	[key:string]:string
}

export default function ColumnGroupDemo(props:any) {

	const yearArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	const tempObj:Sale = {date:''};
	yearArr.map(val=>{
		tempObj[`${val}Time`] = '0';
		tempObj[`${val}Cubic`] = '0';
	});

    const [sales] = useState<Sale[]>(
		[...Array(31).fill(1)].map((val,idx)=>{
			return {...tempObj,date:`${val+idx}일`}
		})
    );
	
    const BodyTemplate = (rowData: Sale, month:string, seperate:string) => {
		// console.log(rowData);
        return rowData[`${month}${seperate}`];
    };

    // const thisYearSaleBodyTemplate = (rowData: Sale) => {
    //     return `${rowData.thisYearSale}%`;
    // };

    // const lastYearProfitBodyTemplate = (rowData: Sale) => {
    //     return `${formatCurrency(rowData.lastYearProfit)}`;
    // };

    // const thisYearProfitBodyTemplate = (rowData: Sale) => {
    //     return `${formatCurrency(rowData.thisYearProfit)}`;
    // };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const lastYearTotal = () => {
        let total = 0;

        for (let sale of sales) {
            total += parseInt(sale.lastYearProfit);
        }

        return formatCurrency(total);
    };

    const thisYearTotal = () => {
        let total = 0;

        for (let sale of sales) {
            total += parseInt(sale.thisYearProfit);
        }

        return formatCurrency(total);
    };

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="" rowSpan={3} />
                <Column header="생산현황" colSpan={24} />
            </Row>
            <Row>
                {
                    [...Array(12).fill(1)].map((val, idx) => (
                        <Column key={idx} header={`${val + idx}월`} colSpan={2} />
                    ))
                }
            </Row>
            <Row>
                {
					yearArr.map((val) => (
						[{head:'생산시간',field:'Time'},{head:'생산수량',field:'Cubic'}].map((wrap)=>(
							<Column className='border border-black' header={wrap.head} field={`${val}${wrap.field}`} />
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
                <Column footer="월 생산량:"/>
				{/* 1월 시간 합 */}
				{/* 1월 수량 합 */}
                {/* <Column footer={lastYearTotal} />
                <Column footer={thisYearTotal} /> */}
            </Row>
        </ColumnGroup>
    );

    return (
        <div className="card">
            <DataTable value={sales} headerColumnGroup={headerGroup} footerColumnGroup={footerGroup} tableStyle={{ minWidth: '50rem' }}>
                <Column field="date" />
				{yearArr.map((val)=>(
					['Time','Cubic'].map((wrap)=>(
						<Column field={`${val}${wrap}`} />
						// <Column field={`${val}Time`} body={(data)=>{return BodyTemplate(data,val,wrap.field)}}/>
					))
				))}
            </DataTable>
        </div>
    );
}
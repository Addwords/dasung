
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

interface Sale {
    [key: string]: any
}

export default function AnalyTable(props: any) {

    const yearArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const tempObj: Sale = { date: '' };
    yearArr.map(val => {
        tempObj[`${val}Time`] = 0;
        tempObj[`${val}Cubic`] = 0;
    });
    const initArr = [...Array(31).fill(1)].map((val, idx) => {
        return { ...tempObj, date: `${val + idx}일` }
    })
    const [analy, setAnaly] = useState<Sale[]>(initArr);

    // useEffect(() => {
    // yearArr.map((val, idx) => {
    //     setAnaly([])
    // })
    // const BodyTemplate = (rowData: Sale, month: string, seperate: string) => {
    //     return rowData[`${month}${seperate}`];
    // };

    // const thisYearSaleBodyTemplate = (rowData: Sale) => {
    //     return `${rowData.thisYearSale}%`;
    // };

    // const lastYearProfitBodyTemplate = (rowData: Sale) => {
    //     return `${formatCurrency(rowData.lastYearProfit)}`;
    // };

    // const thisYearProfitBodyTemplate = (rowData: Sale) => {
    //     return `${formatCurrency(rowData.thisYearProfit)}`;
    // };

    // const formatCurrency = (value: number) => {
    //     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    // };

    // }, [analy]);

    const colTotal = (key: string) => {
        let total = 0;

        for (let sale of analy) {
            total += parseInt(sale[key]);
        }

        return total
    };

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="" rowSpan={3} style={{ borderRight: '1px solid' }} />
                <Column header="2024년 생산현황" alignHeader={'center'} colSpan={24} />
            </Row>
            <Row>
                {
                    [...Array(12).fill(1)].map((val, idx) => (
                        <Column key={idx}
                            alignHeader={'center'}
                            header={`${val + idx}월`}
                            colSpan={2}
                            style={idx < 11 ? { borderRight: '1px solid' } : {}}
                            headerStyle={{ fontSize: '1rem' }}
                        />
                    ))
                }
            </Row>
            <Row>
                {
                    yearArr.map((val) => (
                        [{ head: '생산 시간', field: 'Time' }, { head: '생산 수량', field: 'Cubic' }].map((wrap) => (
                            <Column key={val + wrap.field}
                                style={
                                    val == 'Dec' && wrap.field == 'Cubic' ?
                                        { fontSize: '0.8rem', width: '50px' }
                                        :
                                        { fontSize: '0.8rem', borderRight: '1px solid', width: '50px' }}
                                header={wrap.head}
                                headerStyle={{ wordBreak: 'keep-all' }}
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
                />
                {yearArr.map((val) => (
                    ['Time', 'Cubic'].map((wrap) => (
                        <Column key={val + wrap}
                            footer={colTotal(`${val}${wrap}`)}
                            bodyStyle={{ textAlign: 'center' }}
                            style={val == 'Dec' && wrap == 'Cubic' ? {} : { borderRight: '1px solid' }}
                        />
                    ))
                ))}
            </Row>
        </ColumnGroup>
    );

    return (
        <div className="card">
            <DataTable value={analy}
                headerColumnGroup={headerGroup}
                footerColumnGroup={footerGroup}
                tableStyle={{ width: '1400px' }}
            >
                <Column field="date"
                    style={{ borderRight: '1px solid', width: '10%' }}
                    bodyStyle={{ textAlign: 'center' }}
                    bodyClassName={'font-bold'}
                />
                {yearArr.map((val) => (
                    ['Time', 'Cubic'].map((wrap) => (
                        val == 'Dec' && wrap == 'Cubic' ?
                            <Column key={val + wrap} field={`${val}${wrap}`} bodyStyle={{ textAlign: 'center' }} />
                            :
                            <Column key={val + wrap} field={`${val}${wrap}`} style={{ borderRight: '1px solid' }} bodyStyle={{ textAlign: 'center' }} />
                        // <Column field={`${val}Time`} body={(data)=>{return BodyTemplate(data,val,wrap.field)}}/>
                    ))
                ))}
            </DataTable>
        </div>
    );
}
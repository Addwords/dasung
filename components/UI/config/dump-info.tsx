'use client';

const DumpInfo = (props: any) => {

    // console.log(props.obj, param);
    const dumpInfo = props.obj;
    return (
        <>
            {/* 자가덤프, 외부덤프, 로우더 셋팅 */}
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">내부덤프</span>
                                <div className="text-900 font-medium text-xl">{dumpInfo.jDump}m<sup>3</sup></div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-gray-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-car text-black text-xl" />
                            </div>
                        </div>
                        {/* <span className="text-green-500 font-medium">24 new </span>
                        <span className="text-500">since last visit</span> */}
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">외부덤프</span>
                                <div className="text-900 font-medium text-xl">{dumpInfo.oDump}m<sup>3</sup></div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-yellow-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-car text-yellow-500 text-xl" />
                            </div>
                        </div>
                        {/* <span className="text-green-500 font-medium">%52+ </span>
                        <span className="text-500">since last week</span> */}
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">로우더</span>
                                <div className="text-900 font-medium text-xl">{dumpInfo.rDump}m<sup>3</sup></div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-car text-blue-500 text-xl" />
                            </div>
                        </div>
                        {/* <span className="text-green-500 font-medium">520 </span>
                        <span className="text-500">newly registered</span> */}
                    </div>
                </div>
        </>
    );
}

export default DumpInfo;
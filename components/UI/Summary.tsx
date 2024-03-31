const Summary = (props: any) => {
	// console.log('props:', props);
	return (
		<div className="summary border-4 border-black">
			<div className="col">
				
			</div>
			<div className="col sum-col">
				<div>합계</div>
				<div>정비 <br/>및 <br/>수리내용</div>
			</div>
			<div className="col">
				<div className="sum-grid">
					<div className="font-bold text-xl p-5">
						<p>자가덤프 {props.j}m<sup>3</sup><label id="dumpTot-j">{ props.jtot }</label>m<sup>3</sup></p>
						<p>외부덤프 {props.o}m<sup>3</sup><label id="dumpTot-o">{ props.otot }</label>m<sup>3</sup></p>
						<p>로우더 	{props.r}m<sup>3</sup><label id="dumpTot-r">{ props.rtot }</label>m<sup>3</sup></p>
					</div>
					<div className="">
						<p className="font-bold text-xl pt-6">총 <label id="total" htmlFor="">{ props.total }</label> m<sup>3</sup></p> 
					</div>
				</div>
				<div id="rep" style={{textAlign:'left',paddingLeft:'5%',minHeight:'75px'}} className="text-lg">
					
				</div>
			</div>
        </div>
	);
}
 
export default Summary;
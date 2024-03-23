const Summary = () => {
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
						<p id="jd">자가덤프</p>
						<p id="od">외부덤프</p>
						<p id="rd">로우더</p>
					</div>
					<div className="">
						<p className="font-bold text-xl pt-7">총<label id="total" htmlFor=""></label> M<sup>3</sup></p> 
					</div>
				</div>
				<div id="rep" style={{textAlign:'left',paddingLeft:'10%'}} className="text-lg">
					
				</div>
			</div>
        </div>
	);
}
 
export default Summary;
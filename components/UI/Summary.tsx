const Summary = () => {
	return (
		<div className="summary border-4 border-black">
			<div className="col">
				
			</div>
			<div className="col">
				<div className="h-14">합계</div>
				<div className="h-14">정비 및 수리내용</div>
			</div>
			<div className="col">
				<div className="sum-grid">
					<div className="">
						<p id="">내부덤프</p>
						<p id="">외부덤프</p>
						<p id="">로우더</p>
					</div>
					<div>
						<p>총<label id="total" htmlFor=""></label> M<sup>3</sup></p> 
					</div>
				</div>
				<div id="rep">
					
				</div>
			</div>
        </div>
	);
}
 
export default Summary;
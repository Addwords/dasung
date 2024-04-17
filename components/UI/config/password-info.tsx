'use client';

import { useParams } from "next/navigation";
import { Password } from "primereact/password";
import { useState } from "react";
// import { InputOtp } from 'primereact/inputotp';
// import { InputText } from 'primereact/inputtext';
const PasswordInfo = (props:any) => {
	const param: any = useParams();
	const [password, setPassword] = useState(props.password);
	return (
		<>
			<div className="grid">
				<div className="col-12 lg:col-1 xl:col-1">
					<div className="card p-0">
						<div className="flex justify-content-between">
							<Password
								feedback={false}
								inputId="password1"
								maxLength={4}
								type="number"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password" toggleMask
								
								className="w-[300px]" inputClassName="w-[300px] p-3 md:w-30rem text-xl"
							/>
							{/* <InputOtp value={password} onChange={(e) => setPassword(e.value)} integerOnly/> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default PasswordInfo;
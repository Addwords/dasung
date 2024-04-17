'use client';

import { useParams } from "next/navigation";
import { Password } from "primereact/password";
import { useState } from "react";
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
								inputId="password1"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password" toggleMask
								className="w-[300px]" inputClassName="w-[300px] p-3 md:w-30rem text-xl"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default PasswordInfo;
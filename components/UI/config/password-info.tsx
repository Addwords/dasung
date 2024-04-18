'use client';

import { postFetcher } from "@/lib/common-fetcher";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useRef, useState } from "react";
import { useToast } from "../shadcn/use-toast";

const PasswordInfo = (props: any) => {
	const [password, setPassword] = useState(props.password);
	const [oldPassword, setOldPassword] = useState(props.password);
	const [isChanged, setChanged] = useState(false);
	const [isRejected, setRejected] = useState(false);
	const passwordRef = useRef<HTMLInputElement | null>();
	const { toast } = useToast();
	const changePassword = () => {
		let input = passwordRef.current;
		if (password.length < 4) {
			setRejected(true);
			input?.classList.add('border-red-500');
		} else {
				input?.classList.remove('border-red-500');
			postFetcher('/api/config', { servNm: 'setPassword', comCd: props.comCd, newPassword: password })
				.then(() => {
					setOldPassword(password);
					setChanged(false);
					setRejected(false);
					toast({
						title: '변경 되었습니다.',
						duration: 1000,
					})
				});
		}
	};
	return (
		<>
			<div className="grid">
				<div className="col-12 lg:col-4 xl:col-1">
					<div className="flex flex-col p-0">
						<div className="flex justify-content-between">
							<div className="flex flex-col">
								<Password
									feedback={false}
									inputId="password1"
									inputRef={el => passwordRef.current = el}
									maxLength={4}
									type="number"
									value={password}
									onChange={(e) => {
										setRejected(false);
										setPassword(e.target.value);
										setChanged(e.target.value != oldPassword);
									}}
									placeholder="비밀번호" toggleMask
									className="w-[180px]"
									inputClassName="w-[180px] p-3 text-2xl"
								/>
								{isRejected &&
								<small id="password1" className="text-red-500 pl-3">
									비밀번호는 4자리 입니다.
								</small>
								}
							</div>
							{isChanged &&
								<Button
									severity="success"
									label="save"
									className="h-[50px] mt-2"
									onClick={() => changePassword()}
								/>
							}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default PasswordInfo;
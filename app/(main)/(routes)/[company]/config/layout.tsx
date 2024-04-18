
import { getAssets, getCompany } from "@/lib/summary-util";
import { getOperators } from "@/lib/operators";
import DumpInfo from "@/components/UI/config/dump-info";
import OperatorInfo from "@/components/UI/config/operator-info";
import { Button } from "primereact/button";
import PasswordInfo from "@/components/UI/config/password-info";
import '@/styles/layout/layout.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

const ConfLayout = async ({
	children,
	params,
}: {
	children: JSX.Element
	params: any
	}) => {
	
	const operObj = await getOperators(params.company);
	const dumpObj = await getAssets(params.company);
	const company = await getCompany(params.company);
	
		return (
			<>
				<div className="layout-main-container">
					<div className="layout-main">
						<p className="text-900 font-large text-2xl">{company?.comNm}</p>
						<div className="flex flex-wrap gap-2">
							<Button className="pointer-events-none" label="비밀번호" severity="warning" text />
						</div>
						<PasswordInfo
							comCd={company?.comCd}
							password={company?.password}
						/>
						{/*  */}
						<div className="flex flex-wrap gap-2">
							<Button className="pointer-events-none" label="차량정보" severity="info" text />
						</div>
						<DumpInfo
							obj={dumpObj}
							comcd={params.company}
						/>
						{/*  */}
						<div className="flex flex-wrap gap-2">
							<Button className="pointer-events-none" label="운전자 정보" severity="info" text />
						</div>
						<div className="grid">
							<OperatorInfo
								obj={operObj}
								comcd={params.company}
							/>
						</div>
					</div>
				</div>
			</>
		);
}

export default ConfLayout;
'use client';

import { useParams } from "next/navigation";

const Configure = () => {
	const param:any = useParams();

	return (
		<>
			관리자용 설정화면.
		</>
	);
}
 
export default Configure;
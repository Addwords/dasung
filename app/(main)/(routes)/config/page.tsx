'use client';

import { useParams } from "next/navigation";

const Configure = () => {
	const param = useParams();
	console.log('관리자:', param);
	return (
		<>
			관리자용 설정화면.
		</>
	);
}
 
export default Configure;
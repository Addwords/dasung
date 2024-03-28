import { redirect } from "next/navigation";

// root location에 반응?
console.log('when render?')
const SetupPage = async () => {

    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
	
    // 현재는 오늘날짜 작업화면으로 이동
    // 추후 회사선택 메인화면이나 대시보드 같은 메인화면으로 변경예정😁
    return redirect(`/tables/${today}`);
}
 
export default SetupPage;
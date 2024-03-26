import { redirect } from "next/navigation";

// root location에 반응?
const SetupPage = async () => {

    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
	// let today = '20240326';

    return redirect(`/tables/${today}`);
}
 
export default SetupPage;
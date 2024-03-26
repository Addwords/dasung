import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { intialJobs } from "@/lib/initial-jobs";

// root location에 반응?
const SetupPage = async () => {

    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
	// let today = '20240326';

    return redirect(`/tables/${today}`);

    // return <InitialModal/>
}
 
export default SetupPage;
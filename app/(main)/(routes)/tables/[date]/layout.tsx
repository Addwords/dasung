import { currentJobs } from "@/lib/current-jobs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const DateLayout = async({ 
    children,
    params,
}: {
        children: React.ReactNode;
        params: {date:string};
	}) => {
	
	console.log('params:',params.date);
	const jobs = await currentJobs(params.date);
	// console.log('DateLayout:',jobs);
    // if (!server) {
    //     return redirect('/');   
    // }

	return (
		 <>
			{children}
		 </>
     );
}
 
export default DateLayout;
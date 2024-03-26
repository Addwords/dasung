import { currentJobs } from "@/lib/current-jobs";

const DateLayout = async ({
    children,
    params,
}: {
        children: React.ReactNode;
        params: {date:string};
	}) => {

	const jobsData = await currentJobs(params.date);
	
	return (
		<>
		{children}
		</>
     );
}
 
export default DateLayout;
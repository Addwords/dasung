
import { currentJobs } from "@/lib/current-jobs";
import { monthList } from "@/lib/summary-util";

//페이지와 url매핑정보
export async function generateStaticParams(res: any) {
  // console.log('generateStaticParams:', res);
  const date = new Date();
  const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const dayList = await monthList();
  // console.log('dayList:',dayList)
  return dayList;
}

export default function TableMain() {

  return (
    <>
      children
    </>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";

// root location에 반응?
// console.log('when render?')
const SetupPage = async (compCd:string) => {

    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
	const company = compCd;
    // 현재는 오늘날짜 작업화면으로 이동
    // 추후 회사선택 메인화면이나 대시보드 같은 메인화면으로 변경예정😁
    return redirect(`/${company}/${today}`);
}

const selectPage = ()=>{
    const date = new Date();
    const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2,'0')}`;
return(
    <>
    {/* <button>(주)다성 용인지점</button> */}
    {/* <a href={`/001/${today}`}>(주)다성 용인지점</a> */}
        <div className="flex h-lvh justify-center" style={{alignItems:'center'}}>
            <div className="mb-32 grid gap-6 text-center lg:max-w-5xl lg:mb-0 lg:grid-cols-2 lg:text-left">
                <Link href={`/001/${today}`}>
                    <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors
                    hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                    rel="noopener noreferrer">
                        <h2 className={`mb-3 text-2xl font-semibold`}>(주)다성 용인지점</h2>
                    </div>
                </Link>

                {/*  */}
                <a
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>준비중</h2>
                </a>
                <a
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>준비중</h2>
                </a>
                <a
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
                rel="noopener noreferrer">
                    <h2 className={`mb-3 text-2xl font-semibold`}>준비중</h2>
                </a>
            </div>
        </div>
    </>
)
}
export default selectPage;
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
// import { NavigatioAction } from "@/components/navigation/navigation-action";
import { Separator } from "@/components/UI/separator";
import { ScrollArea } from "@/components/UI/scroll-area";
import { NavigationItem } from "@/components/navigation/navigation-item";
// import { ModeToggle } from "../mode-toggle";
// import { UserButton } from "@clerk/nextjs";
// import { LangToggle } from "../lang-toggle";

export const NavigationSideBar = async () => {

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#727274] py-3 non-print">
            {/* <NavigatioAction /> */}
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-sm w-10 mx-auto"
            />
            <ScrollArea className="flex-1 w-full">
                <NavigationItem
                    id={'configuration'}
                    name={'설정'}
                    imageUrl={'/setting.png'}
                />
                <NavigationItem
                    id={'home'}
                    name={'공장선택'}
                    imageUrl={'/home.png'}
                />
                <NavigationItem
                    id={'table'}
                    name={'작업'}
                    imageUrl={'/dump.png'}
                />
                <NavigationItem
                    id={'analy'}
                    name={'통계'}
                    imageUrl={'/analysis.png'}
                />
                {/* {servers.map((server) => (
                    <div key={server.id} className="">
                    </div>
                ))} */}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                {/* <LangToggle />
                <ModeToggle /> */}
            </div>
        </div>
    )
}
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps{
    id: string;
    imageUrl: string;
    name: string;
};

export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
	const params = useParams();
	const router = useRouter();
	// console.log('NavigationItem',params);
	const onClick = () => {
		if (id == 'home') {
			router.replace(`/`);
		} else if (id == 'configuration') {
			router.replace(`/${params.company}/config`);
		}
	}
    return (
		<ActionTooltip
			side="right"
			align="center"
			label={name}
		>
			<button
				onClick={onClick}
				className="group relative flex items-center">
				<div className={cn(
					"absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
					params?.serverId !== id && "group-hover:h-[20px]",
					params?.serverId === id ?  "h-[36px]" : "h-[8px]",

				)} />

				<div className={cn(
					"relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all mb-2 overflow-hidden",
					params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
				)}>
					<Image
						fill
						src={imageUrl}
						alt={name}
						sizes="2"
					/>
				</div>
			</button>
		</ActionTooltip>
    )
}
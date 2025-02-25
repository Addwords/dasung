"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { SyncLoader } from "react-spinners";
import { useState } from "react";

interface NavigationItemProps {
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
	const [loading, setLoading] = useState(false);
	const onClick = () => {
		if (id == 'home') {
			router.replace(`/`);
		} else if (id == 'configuration') {
			// setLoading(true);
			router.replace(`/${params.compCd}/config`);
		} else if (id == 'table') {
			const day = new Date();
			location.replace(`/${params.compCd}/${day.getFullYear()}${String(day.getMonth() + 1).padStart(2, '0')}${String(day.getDate()).padStart(2, '0')}`);
		} else if (id == 'analy') {
			// router.prefetch(`/${params.compCd}/analy`, { kind: PrefetchKind.FULL });
			router.replace(`/${params.compCd}/analy`,{scroll:true});
			// location.replace(`/${params.compCd}/analy`);
		} else if (id == 'analy2') {
			router.replace(`/${params.compCd}/analy2`);
		}
	}
	return (
		<>
			{loading &&
				<div className="absolute backdrop-brightness-95 loadingwrap" style={{ zIndex: 1102 }}>
					<SyncLoader color="rgb(54, 215, 183)" size={20} />
				</div>
			}
			<ActionTooltip
				side="right"
				align="center"
				label={name}
			>
				<button
					onClick={onClick}
					className="group relative flex items-center">
					<div style={{ backgroundColor: 'hsl(240 5.9% 10%)' }}
						className={cn(
							"absolute left-0 rounded-none transition-all w-[4px]",
							params?.serverId !== id && "group-hover:h-[20px]",
							params?.serverId === id ? "h-[36px]" : "h-[8px]",

						)} />

					<div className={cn(
						"relative group flex mx-3 h-[48px] w-[48px] rounded-none group-hover:rounded-[16px] transition-all mb-2 overflow-hidden",
						params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
					)}>
						<Image
							fill
							sizes="2"
							src={imageUrl}
							alt={name}
							priority={true}
						/>
					</div>
				</button>
			</ActionTooltip>
		</>
	)
}
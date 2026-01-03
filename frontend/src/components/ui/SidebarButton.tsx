import {Button} from "@/components/ui/button.tsx";
import type {SidebarButtonProps} from "@/types.ts";
import {cn} from "@/lib/utils.ts";

export function SidebarButton({icon:Icon,label,className,...props}:SidebarButtonProps){
    return (
        <>
            <Button
                className={cn("flex p-2 w-full cursor-pointer rounded-lg border-b-2 border-logo-color/40 hover:bg-logo-color hover:text-sky-950 gap-2 font-medium text-lg",
                className    )}
                {...props}
                >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span>{label}</span>
            </Button>
        </>
    )
}
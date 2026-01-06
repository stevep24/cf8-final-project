import * as React from "react";


export type SidebarButtonProps = React.ComponentProps<"button"> & {
    icon: React.ElementType;
    label: string;
}

export type TextFieldProps = {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    pattern?: string;
    onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export interface AuthUser {
    username: string;
    first_name: string;
    last_name: string;
    psychologist_id: number;
    email: string;
}


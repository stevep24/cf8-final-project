import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {TextFieldProps} from "@/types.ts";

export function FormTextField({
    id,
    name,
    label,
    pattern,
    type,
    placeholder,
    required,
    className="",
    onChange,
    onBlur,
    onFocus,
}: TextFieldProps) {

    return (
        <div className={`m-3 p-4 ${className}`}>
            <Label className="text-logo-color cursor-pointer mb-1 required:" htmlFor={id}>{label}</Label>
            <Input
                pattern={pattern}
                required = {required}
                name={name}
                type={type}
                id={id}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}/>


        </div>

    )

}

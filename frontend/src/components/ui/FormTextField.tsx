import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {TextFieldProps} from "@/types.ts";

export function FormTextField({
    id,
    label,
    pattern,
    type,
    placeholder,
    required,
    className=""}: TextFieldProps) {
    return (
        <div className={`m-3 p-4 ${className}`}>
            <Label className="text-logo-color mb-1 required:" htmlFor={id}>{label}</Label>
            <Input
                pattern={pattern}
                required = {required}
                type={type}
                id={id}
                placeholder={placeholder} />

        </div>

    )

}

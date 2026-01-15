import type { ComponentProps, ElementType } from "react";

export type SidebarButtonProps = React.ComponentProps<"button"> & {
    icon: React.ElementType;
    label: string;
};

export type TextFieldProps = {
    id: string;
    name: string;
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

export type Patient = {
    id: number;
    first_name: string;
    last_name: string;
    mental_disorder: string;
    //birth_date:
    phone_number: string;
    email: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    status: string;
    notes: string

};


export type AppointmentStatus =
    | "SCHEDULED"
    | "COMPLETED"
    | "CANCELED"
    | "NO_SHOW";

export type SessionType = "IN_PERSON" | "ONLINE";

export interface Appointment {
    id: number;

    patient: {
        id: number;
        first_name: string;
        last_name: string;
    };

    session_datetime: string;
    duration_minutes: number;
    status: AppointmentStatus;
    session_type: SessionType;
    price: string | null;
    notes_from_therapist?: string | null;
};


type PsychologistProfile = {
    user: {
        email: string;
    };
    first_name: string;
    last_name: string;
    phone_number: string;
    specialization: string;
    license_number: string;
    notes?: string;
};
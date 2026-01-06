type PasswordChecklistProps = {
    password: string;
};
const passwordRules = {
    length: (v: string) => v.length >= 8,
    uppercase: (v: string) => /[A-Z]/.test(v),
    lowercase: (v: string) => /[a-z]/.test(v),
    number: (v: string) => /\d/.test(v),
    symbol: (v: string) => /[@$!%*?&]/.test(v),
};

export const PasswordChecklist = ({ password }: PasswordChecklistProps) => {
    const checks = {
        "Τουλάχιστον 8 χαρακτήρες": passwordRules.length(password),
        "Ένα κεφαλαίο γράμμα": passwordRules.uppercase(password),
        "Ένα μικρό γράμμα": passwordRules.lowercase(password),
        "Έναν αριθμό": passwordRules.number(password),
        "Ένα σύμβολο (@$!%*?&)": passwordRules.symbol(password),
    };

    return (
        <div className="mt-2 p-3 rounded-md bg-sky-900 text-sm text-left">
            <ul className="space-y-1">
                {Object.entries(checks).map(([label, ok]) => (
                    <li
                        key={label}
                        className={`flex items-center gap-2 ${
                            ok ? "text-green-400" : "text-gray-400"
                        }`}
                    >
                        <span>{ok ? "✔" : "•"}</span>
                        <span>{label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

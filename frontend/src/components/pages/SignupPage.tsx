import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormTextField} from "@/components/ui/FormTextField.tsx";
import {Label} from "@/components/ui/label.tsx";


const SignupPage = () => {

    return (
        <>
            <div className=" min-h-[92vh] flex items-center justify-center">
                <form
                    className="bg-sky-950 max-w-4xl w-150 mx-4 border rounded-md grid grid-cols-1 md:grid-cols-2 text-white"
                    autoComplete="off"
                >
                    <FormTextField required id="first_name" label="Όνομα" type="text" placeholder="Π.χ Στέφανος" />

                    <FormTextField
                            required label="Επώνυμο"
                            type="password" id="last_name"
                            placeholder="Π.χ Παναγιωτόπουλος" />

                    <FormTextField
                            label="Κινήτο"
                            required
                            pattern="^69\d{8}$"
                            type="password" id="phone"
                            placeholder="Π.χ 6971924363" />

                    <FormTextField
                            label="Ειδικότητα"
                            required
                            type="password"
                            id="specialization"
                            placeholder="Π.χ Παιδοψυχολόγος" />

                    <FormTextField
                            label="Αριθμός άδειας"
                            required
                            type="password"
                            id="license_number"
                            placeholder="Π.χ 1972-12301" />

                    <div className="grid w-full m-3 p-4">
                        <Label className="text-logo-color mb-1" htmlFor="message">Σημειώσεις</Label>
                        <Textarea placeholder="" id="message" />
                    </div>

                    <FormTextField
                            label="E-mail"
                            required
                            type="email"
                            id="email"
                            placeholder="Π.χ steve_pan@aueb.gr" />

                    <FormTextField
                        label="Κωδικός Πρόσβασης"

                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            required
                            type="password" id="password"
                            placeholder="Εισάγεται τον κωδικό σας" />
                    <div className="md:col-span-2 flex justify-center mt-4  ">
                        <Button
                            className="text-xl h-12 w-30 bg-logo-color hover:bg-orange-400 text-sky-950 block mx-auto mb-3 "
                            // onSubmit=""
                        >
                            Sign up
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default SignupPage;
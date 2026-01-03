import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";


const FirstPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <main className="
                            py-10 flex items-center justify-center">
                <div className="container w-150 p-5  mx-auto my-50  text-logo-color border-4 border-logo-color rounded-lg">
                    <section>
                    <h1 className="mb-3 font-bold text-2xl">
                        Ο προσωπικός σου βοηθός για ραντεβού & ασθενείς
                    </h1>
                    <p className="">
                        Το <span className="font-medium">ManagePsy</span> είναι ο σύγχρονος, ασφαλής ψηφιακός βοηθός κάθε επαγγελματία ψυχικής υγείας.
                        Σε βοηθά να διαχειρίζεσαι ολόκληρη τη θεραπευτική σου πρακτική από ένα σημείο:
                        να καταγράφεις συνεδρίες, να οργανώνεις ραντεβού, να παρακολουθείς την πρόοδο των ασθενών,
                        να δημιουργείς σχέδια θεραπείας και να κρατάς σημειώσεις με τρόπο απλό, γρήγορο και απόλυτα προστατευμένο.

                        Με ένα καθαρό και ευέλικτο περιβάλλον χρήσης, μπορείς:
                        <ul className="font-medium mt-1 mb-2 list-disc marker:bg-logo-color ml-4.5">
                            <li> να βλέπεις άμεσα το ημερολόγιο με τα ραντεβού σου,</li>
                            <li> να αναζητάς εύκολα ασθενείς και προηγούμενες συνεδρίες,</li>
                            <li> να αποθηκεύεις σημαντικές πληροφορίες με δομημένο τρόπο,</li>
                            <li> και να έχεις πάντα διαθέσιμο το ιστορικό κάθε θεραπευόμενου.</li>
                        </ul>
                        Το ManagePsy σου επιτρέπει να επικεντρωθείς σε αυτό που έχει πραγματική σημασία:
                        την ποιότητα της θεραπευτικής σχέσης και την πρόοδο του ασθενή σου.
                    </p>
                    </section>
                    <div className="flex items-center justify-between mt-4 pl-13 pr-13 ">
                        <Button  className="bg-logo-color hover:bg-amber-500"
                        onClick={() => navigate("/signup")}>
                             Χτίσε το δικό σου προφίλ
                        </Button>
                        <Button
                            className='bg-logo-color hover:bg-amber-500'
                            onClick={() => navigate('/login')}>
                            Σύνδεση Ψυχολόγου
                        </Button>
                    </div>
                </div>
            </main>
        </>
    )
}
export default FirstPage
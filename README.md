# cf8-final-project
# ManagePsy

Τελική εργασία Coding Factory 8.

Web εφαρμογή διαχείρισης ασθενών και ραντεβού για ψυχολόγους.
Το backend υλοποιείται με Django REST Framework και βάση δεδομένων MySQL,
ενώ το frontend με React.

---

## Build & Run Instructions

### Backend (Django + MySQL)

Απαιτήσεις:
- Python 3.10+
- MySQL Server

Δημιουργία και ενεργοποίηση virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```
Εγκατάσταση dependencies:
```bash
pip install -r requirements.txt
```
Δημιουργήστε αρχείο .env στον φάκελο του backend με τα στοιχεία της βάσης:
```bash
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

Εκτέλεση migrations και εκκίνηση server:
```bash
python manage.py migrate
python manage.py runserver
```
Το backend τρέχει στο:
http://localhost:8000

### Frontend (React)

```bash
npm install
npm run dev
```
Το frontend τρέχει στο:
http://localhost:5173
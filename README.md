# BookMind 📖✨

Platformă care te ajută să înțelegi rapid orice carte prin **rezumate generate cu AI**, **flashcard-uri inteligente**, **testarea cunoștințelor** și **progres personal**.

Construită cu Next.js (App Router), TypeScript, Tailwind, Prisma + PostgreSQL, Auth.js și **AI avansat** (Google Gemini — nivel gratuit; opțional Anthropic Claude).

---

## ✨ Funcționalități

- **Landing page premium** cu temă „cer senin”: gradient, nori animați, glassmorphism, parallax discret.
- **Autentificare** email + parolă (Auth.js / NextAuth v5, parole hash-uite cu bcrypt), rute protejate prin middleware.
- **Căutare carte** prin Google Books API (fallback Open Library) — copertă, autor, an, descriere, cu confirmare „Da / Nu”.
- **Rezumate AI** complete sau pe capitol, structurate pe secțiuni cu puncte-cheie.
- **Confirmare citire** — flashcard-urile sunt blocate până bifezi „Am citit rezumatul”.
- **15 flashcard-uri** generate automat (alegere multiplă / adevărat-fals / răspuns scurt).
- **Corectare + explicații** — scor, procent, bară animată, nivel de performanță și explicații AI pentru fiecare greșeală, cu referință la rezumat.
- **Dashboard, istoric și profil** cu statistici (cărți, rezumate, teste, scor mediu).
- **UX premium** — skeleton loaders, toast notifications, empty states, error boundaries, animații Framer Motion, responsive complet.

> Fără nicio cheie AI configurată, aplicația folosește **conținut AI demonstrativ** (etichetat clar) ca să poți parcurge tot fluxul end-to-end. Pentru rezultate reale, adaugă o cheie **gratuită** `GEMINI_API_KEY` (vezi mai jos).

---

## 🧱 Stack tehnologic

| Zonă        | Tehnologie                                   |
| ----------- | -------------------------------------------- |
| Framework   | Next.js 15 (App Router) + React 19           |
| Limbaj      | TypeScript (strict)                          |
| Stilizare   | Tailwind CSS + shadcn/ui (componente proprii)|
| Animații    | Framer Motion                                |
| Bază de date| SQLite (dev) → PostgreSQL (prod) + Prisma ORM|
| Auth        | Auth.js / NextAuth v5 (Credentials + bcrypt) |
| AI          | Google Gemini (`gemini-2.5-flash`, REST, gratuit) — opțional Anthropic Claude (`claude-opus-4-8`) |
| Validare    | Zod + React Hook Form                        |
| Iconografie | Lucide                                       |

---

## 🚀 Instalare și rulare

### 1. Cerințe

- Node.js 18.18+ (recomandat 20+)
- **Nicio bază de date externă** pentru dezvoltare — se folosește SQLite (un fișier local `prisma/dev.db`).

### 2. Instalează dependințele

```bash
npm install
```

### 3. Configurează variabilele de mediu

```bash
cp .env.example .env
```

Valorile implicite din `.env.example` funcționează deja pentru dezvoltare locală:

- `DATABASE_URL` — implicit `file:./dev.db` (SQLite, zero setup).
- `AUTH_SECRET` — generează cu `npx auth secret` (sau orice string lung aleator).
- `GEMINI_API_KEY` — **recomandat, gratuit**, de la <https://aistudio.google.com/apikey> (fără card). Folosit pentru rezumate, flashcard-uri și explicații reale.
- `ANTHROPIC_API_KEY` — alternativă opțională plătită, de la <https://console.anthropic.com/> (folosită doar dacă lipsește `GEMINI_API_KEY`). Fără nicio cheie se folosește conținut demonstrativ.
- `GOOGLE_BOOKS_API_KEY` — opțional (crește limita de rate a căutării).

### 4. Creează schema în baza de date

```bash
npm run db:push
```

### 5. Pornește aplicația

```bash
npm run dev
```

Deschide <http://localhost:3000>.

> **Producție (PostgreSQL):** schimbă `provider` în `prisma/schema.prisma` la `"postgresql"`,
> pune un `DATABASE_URL` de Postgres (Neon/Supabase) și rulează `npm run db:push`.

---

## 🧭 Fluxul aplicației

1. **Creează cont** → ești autentificat automat.
2. **Carte nouă** → caută titlul → confirmă „Da, aceasta este”.
3. Alege **rezumat complet** sau **pe capitol** → generează.
4. Citește rezumatul → bifează **„Am citit rezumatul”** (deblochează testul).
5. Rezolvă cele **15 flashcard-uri**.
6. Vezi **scorul, procentul și explicațiile** pentru greșeli.
7. Găsești tot în **Dashboard** și **Istoric**.

---

## 📁 Structura proiectului

```
src/
├─ app/
│  ├─ (marketing)/           # landing + pagini legale
│  ├─ (auth)/                # login, register
│  ├─ (app)/                 # dashboard, books, history, profile (protejate)
│  │  └─ books/{new,[bookId],summary/[id],quiz/[id]/results}
│  └─ api/auth/[...nextauth] # handler Auth.js
├─ components/
│  ├─ ui/                    # primitive shadcn-style
│  ├─ marketing/             # secțiuni landing
│  └─ app/                   # componente de aplicație
├─ server/
│  ├─ actions/               # Server Actions (auth, books, summary, quiz)
│  ├─ ai/generate.ts         # dispecer provider (Gemini/Claude) + fallback mock
│  ├─ ai/gemini.ts           # integrare Google Gemini (REST, gratuit)
│  ├─ books/search.ts        # Google Books / Open Library
│  ├─ stats.ts               # statistici utilizator
│  └─ db.ts                  # Prisma singleton
├─ lib/                      # auth, session, utils, validări Zod
└─ types/                    # tipuri partajate
prisma/schema.prisma         # modele + relații
```

---

## 🔒 Securitate

- Validare **Zod** pe fiecare intrare (client + server).
- Parole hash-uite cu **bcrypt** (cost 12).
- Rute protejate prin **middleware** (verificare sesiune JWT).
- Cheile API trăiesc doar în **variabile de mediu** pe server; nu sunt expuse în client.
- Verificarea proprietății pe fiecare acțiune (un user accesează doar propriile cărți / rezumate / teste).

---

## 📦 Scripturi utile

| Comandă             | Descriere                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Server de dezvoltare                       |
| `npm run build`     | Build de producție (`prisma generate` + `next build`) |
| `npm run start`     | Rulează build-ul de producție              |
| `npm run typecheck` | Verifică tipurile TypeScript               |
| `npm run db:push`   | Sincronizează schema Prisma cu baza de date|
| `npm run db:studio` | Deschide Prisma Studio                     |

---

## 🗺️ Următoarele iterații

- Resetare parolă + verificare email
- Google Login (OAuth)
- Upload copertă (UploadThing) + identificare AI din imagine
- Rezumate pe mai multe capitole simultan, export PDF

---

Construit cu ❤️ folosind Next.js și Google Gemini.

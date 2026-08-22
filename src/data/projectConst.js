// Projects content. Every entry is a plain, JSON-serializable object:
// strings, numbers, booleans, and null only (no JSX, no functions, no
// imported image objects) — ready to be stored as-is in a database
// document.
//
// Field notes:
// - `slug`: stable, URL-safe id derived from the title — for future
//   per-project routes/admin editing.
// - `type`: the free-text category/description label already used in the
//   UI (kept verbatim — it mixes role + platform + stack in a way that
//   isn't a clean enum, and inventing one would misrepresent the source).
// - `titleNote`: a short annotation that used to be rendered as a small
//   red `<p>` next to the title (e.g. "(final name pending)"). Preserved
//   as a separate plain field instead of embedded JSX; null where there
//   is no annotation.
// - `note`: a caveat/status sentence that used to be wrapped in `<strong>`
//   inside the JSX `summary` (e.g. "(This site is under construction...)").
//   Preserved as a separate plain field so `summary` itself stays a plain
//   description string; null where there is no such caveat.
// - `deployUrl`: the live/demo URL. Several projects only ever linked to
//   "/" (no real deployed site) — preserved as `null` rather than a
//   placeholder path, since "/" was never a real deploy link.
// - `githubUrl`: renamed from the old `iconWeb` field (it was always a
//   GitHub repository URL).
// - `icon`: a stable string key (every project used the same "github"
//   icon), resolved via src/lib/iconMap.js + <Icon />.
// - `technologies`: NOT populated by parsing the free-text summaries.
//   Doing so would require subjective judgment about what counts as a
//   "technology" in prose and risks inventing/mis-tagging data that was
//   never structured to begin with. Left as an empty array, ready for an
//   admin to fill in deliberately.
// - `featured`: no project is currently marked/curated as featured in the
//   existing UI (the Projects page renders all of them identically), so
//   this defaults to `false` for every entry rather than guessing a
//   curation that doesn't exist today.
// - `image`: a root-relative string path into `public/` (e.g.
//   "/images/projects/proy/ondasagave.jpg") instead of an imported
//   StaticImageData object, so the record is a plain string a database
//   can store as-is. It's expected to become an uploaded-file URL once
//   the admin/file-storage work lands in a later phase.
// - `imageWidth` / `imageHeight`: the source image's real pixel
//   dimensions. next/image requires explicit width/height (or `fill`)
//   for string `src` values (it can no longer infer them from a static
//   import), so these are carried alongside the path rather than
//   hardcoded in the component.

export const projects = [
  {
    slug: "mercado-agave",
    title: "Mercado Agave",
    titleNote: null,
    type: "Front-End E-Commerce Website",
    summary: "Built a web app using React, Redux, Axios, CSS Modules, and a fake API store for back-end. Deployed on Vercel. The website features a list of products(cards), a product detail component, an upper navigation bar, a menu of categories, and shopping cart logic with local storage.",
    note: null,
    image: "/images/projects/proy/ondasagave.jpg",
    imageWidth: 1920,
    imageHeight: 1226,
    deployUrl: "https://mercadoagave.vercel.app/",
    githubUrl: "https://github.com/Vontrauwitz/mercadoagave",
    icon: "github",
    technologies: [],
    featured: false,
  },
  {
    slug: "pilou-form",
    title: "Pilou Form",
    titleNote: null,
    type: "Technical assessment of a backend-integrated form for a full-stack role.",
    summary: "It's a technical assessment of a form built in Next.js with Tailwind CSS, integrated with a Python backend using the Django framework and libraries such as REST. The form is validated using JavaScript without libraries, designed with simplicity inspired by the company's webpage, in accordance with the nature of the technical test.",
    note: null,
    image: "/images/projects/proy/expRB_P_Test.jpg",
    imageWidth: 6001,
    imageHeight: 4001,
    deployUrl: "https://front-pilou-test.vercel.app/formulario/",
    githubUrl: "https://github.com/Vontrauwitz/prueba_rails",
    icon: "github",
    technologies: [],
    featured: false,
  },
  {
    slug: "garantimex",
    title: "GarantiMex",
    titleNote: null,
    type: "Front-End Pre-Owned Services Website",
    summary: "A client wanted a page of services for pre-owned cars such as guarantees, protection services such as the GAP and painting job promotions, etc. Technologies such as React, Next, and Chakara UI were used.",
    note: null,
    image: "/images/projects/proy/expgaranti.jpg",
    imageWidth: 1920,
    imageHeight: 1080,
    deployUrl: "https://safe-and-sound-6bjn5go66-vontrauwitz.vercel.app",
    githubUrl: "https://github.com/Vontrauwitz/SafeAndSound",
    icon: "github",
    technologies: [],
    featured: false,
  },
  {
    slug: "criptoweb",
    title: "Criptoweb",
    titleNote: "(final name pending)",
    type: "Front-End New Meme-Coin Website",
    summary: "Web page inspired by meme coins and it is planned to launch one in the future, this page will have the whitepaper and the action plan and more information about the token along with a link to purchase, this page uses React, and Next.",
    note: "(This site is under construction and is missing future features)",
    image: "/images/projects/proy/diagcripto.jpg",
    imageWidth: 1920,
    imageHeight: 1078,
    deployUrl: "https://criptoweb.vercel.app/",
    githubUrl: "https://github.com/Vontrauwitz/criptoweb",
    icon: "github",
    technologies: [],
    featured: false,
  },
  {
    slug: "profy",
    title: "ProFY",
    titleNote: null,
    type: "Full-Stack Phone Medical APP Multi Platform",
    summary: "Final Project of Bootcam Henry, which was a team project under scrum in 3 sprints, is a medical application that brings together medical professionals and people to be able to make face-to-face, virtual medical appointments and also telephone consultations, includes packages for services, this project has a admin panel to be able to feed the backend and make the site self-sustaining without the need for a base programmer in the company, the backend uses mongo atlas and moongose with Parton model controller view, the technologies used such as: React Native, Expo, Redux-Toolkit, Mongo Atlas, Moongose, Node js, React js, Material UI, Cloudinary, Express, Stripe, JWT Authentication, Atuth0, Firebase, Local Storage, Bcrypt, Nodemailer, Figma, Scrum, etc.",
    note: null,
    image: "/images/projects/proy/h_pro.jpg",
    imageWidth: 1920,
    imageHeight: 1278,
    deployUrl: null,
    githubUrl: "https://github.com/GermanEH/Proyecto-Final-Pro-FY/blob/develop/api/package.json",
    icon: "github",
    technologies: [],
    featured: false,
  },
  {
    slug: "poke-app-mobile",
    title: "Poke App Mobile",
    titleNote: null,
    type: "Front-End Pokemon Mobile APP Multi Platform",
    summary: "This is a react native app that uses an api (pokeAPI) and gives pokemon stats it uses local storage and allows you to enter with a username and password (currently fixed) and allows you to save pokemons in favorites, the technologies it uses is React Native , Expo, Loadash, Formik, Yup, etc.",
    note: "(This application is going to be renewed, it is going to join the backend of the other ReactJS application that I have, it will be authenticated and it will be uploaded to the Google Play Store.)",
    image: "/images/projects/proy/blue_plate_pkm_nve.jpg",
    imageWidth: 1398,
    imageHeight: 980,
    deployUrl: null,
    githubUrl: "https://github.com/Vontrauwitz/PokeDex-ReactNative",
    icon: "github",
    technologies: [],
    featured: false,
  },
  {
    slug: "poke-app-website",
    title: "Poke App Website",
    titleNote: null,
    type: "Full-Stack Pokemon Website FullStack APP",
    summary: "This is an individual project from Bootcamp Henry, and it is a Pokémon application that uses an API (pokeAPI). Apart from bringing Pokémon, it allows you to filter them by name and create your own. It is a CRUD since it has a Postgres Database and uses Sequelize and Node.js in the backend. The technologies used by this website are: React, React DOM, React Router DOM, Redux, Axios, Node.js, Sequelize, Postgres, etc.",
    note: "(This website is going to be renewed and redeployed applying newer technologies, and changing the UX/UI)",
    image: "/images/projects/proy/curved_lines_diagonal_pokemon.jpg",
    imageWidth: 1400,
    imageHeight: 980,
    deployUrl: null,
    githubUrl: "https://github.com/Vontrauwitz/Pi-Countries-Vontrauwitz",
    icon: "github",
    technologies: [],
    featured: false,
  },
  {
    slug: "countries-website",
    title: "Countries Website",
    titleNote: null,
    type: "Full-Stack Countries & Activities Website APP",
    summary: "This is an individual project from Bootcamp Henry, that uses an API (Restcountries) that brings data from the countries and a section was created so that you can create activities in each country or in several and view them, it allows you to filter and search for countries as well as activities It is a CRUD since it has a Postgres Database and uses Sequelize and Node.js in the backend. The technologies used by this website are: React, React DOM, React Router DOM, Redux, Axios, Node.js, Sequelize, Postgres, etc.",
    note: "(This website is going to be renewed and redeployed applying newer technologies, and changing the UX/UI)",
    image: "/images/projects/proy/cricle_blue_countries.jpg",
    imageWidth: 1400,
    imageHeight: 980,
    deployUrl: null,
    githubUrl: "https://github.com/Vontrauwitz/Pi-Countries-Vontrauwitz",
    icon: "github",
    technologies: [],
    featured: false,
  },
  {
    slug: "food-app-website",
    title: "Food APP Website",
    titleNote: null,
    type: "Full-Stack Recipes Website FullStack APP",
    summary: "This is an individual project from Bootcamp Henry, that uses an API (Spoonacular) that brings recipe data. Here you can create your own ones as well as see the API ones and you can filter it by recipe names or by pre-established diets. It is a CRUD since it has a Postgres Database and uses Sequelize and Node.js in the backend. The technologies used by this website are: React, React DOM, React Router DOM, Redux, Axios, Node.js, Sequelize, Postgres, etc.",
    note: "(This website is going to be renewed and redeployed applying newer technologies, and changing the UX/UI)",
    image: "/images/projects/proy/plate_sun_food.jpg",
    imageWidth: 1400,
    imageHeight: 980,
    deployUrl: null,
    githubUrl: "https://github.com/Vontrauwitz/PI-Food",
    icon: "github",
    technologies: [],
    featured: false,
  },
];

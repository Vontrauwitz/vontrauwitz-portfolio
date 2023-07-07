import { GithubIcon } from "@/components/Icons"

export const projects = [
  {
    type: "Front-End E-Commerce Website",
    title: "Mercado Agave",
    summary: "Built a web app using React, Redux, Axios, CSS Modules, and a fake API store for back-end. Deployed on Vercel. The website features a list of products(cards), a product detail component, an upper navigation bar, a menu of categories, and shopping cart logic with local storage.",
    img: require("../../public/images/projects/proy/ondasagave.jpg"),
    link: "https://mercadoagave.vercel.app/",
    icon: <GithubIcon className="w-5 ml-1" />,
    iconWeb: "https://github.com/Vontrauwitz/mercadoagave",
  },
  {
    type: "Front-End Pre-Owned Services Website",
    title: "GarantiMex",
    summary: "A client wanted a page of services for pre-owned cars such as guarantees, protection services such as the GAP and painting job promotions, etc. Technologies such as React, Next, and Chakara UI were used.",
    img: require("../../public/images/projects/proy/expgaranti.jpg"),
    link: "https://garantimex.com/",
    icon: <GithubIcon className="w-5 ml-1" />,
    iconWeb: "https://github.com/Vontrauwitz/SafeAndSound",
  },
  {
    type: "Front-End New Meme-Coin Website",
    title:
      (
        <div>
          Criptoweb
          <p className='text-red-500 text-xs'>(final name pending)</p>
        </div>
      ),
    summary:
      (
        <div>
          Web page inspired by meme coins and it is planned to launch one in the future, this page will have the whitepaper and the action plan and more information about the token along with a link to purchase, this page uses React, and Next.
          <strong>(This site is under construction and is missing future features)</strong >
        </div>
      ),
    img: require("../../public/images/projects/proy/diagcripto.jpg"),
    link: "https://criptoweb.vercel.app/",
    icon: <GithubIcon className="w-5 ml-1" />,
    iconWeb: "https://github.com/Vontrauwitz/criptoweb",
  },
  {
    type: "Full-Stack Phone Medical APP Multi Platform",
    title: "ProFY",
    summary: "Final Project of Bootcam Henry, which was a team project under scrum in 3 sprints, is a medical application that brings together medical professionals and people to be able to make face-to-face, virtual medical appointments and also telephone consultations, includes packages for services, this project has a admin panel to be able to feed the backend and make the site self-sustaining without the need for a base programmer in the company, the backend uses mongo atlas and moongose with Parton model controller view, the technologies used such as: React Native, Expo, Redux-Toolkit, Mongo Atlas, Moongose, Node js, React js, Material UI, Cloudinary, Express, Stripe, JWT Authentication, Atuth0, Firebase, Local Storage, Bcrypt, Nodemailer, Figma, Scrum, etc.",
    img: require("../../public/images/projects/proy/h_pro.jpg"),
    link: "/",
    icon: <GithubIcon className="w-5 ml-1" />,
    iconWeb: "https://github.com/GermanEH/Proyecto-Final-Pro-FY/blob/develop/api/package.json",
  },
  {
    type: "Front-End Pokemon Mobile APP Multi Platform",
    title: "Poke App Mobile",
    summary: (
      <div>
        This is a react native app that uses an api (pokeAPI) and gives pokemon stats it uses local storage and allows you to enter with a username and password (currently fixed) and allows you to save pokemons in favorites, the technologies it uses is React Native , Expo, Loadash, Formik, Yup, etc.
        <strong>(This application is going to be renewed, it is going to join the backend of the other ReactJS application that I have, it will be authenticated and it will be uploaded to the Google Play Store.)</strong>
      </div>
    ),
    img: require("../../public/images/projects/proy/blue_plate_pkm_nve.jpg"),
    link: "/",
    icon: <GithubIcon className="w-5 ml-1" />,
    iconWeb: "https://github.com/Vontrauwitz/PokeDex-ReactNative",
  },
  {
    type: "Full-Stack Pokemon Website FullStack APP",
    title: "Poke App Website",
    summary: (
      <div>
        This is an individual project from Bootcamp Henry, and it is a Pokémon application that uses an API (pokeAPI). Apart from bringing Pokémon, it allows you to filter them by name and create your own. It is a CRUD since it has a Postgres Database and uses Sequelize and Node.js in the backend. The technologies used by this website are: React, React DOM, React Router DOM, Redux, Axios, Node.js, Sequelize, Postgres, etc.
        <strong>(This website is going to be renewed and redeployed applying newer technologies, and changing the UX/UI)</strong>
      </div>
    ),
    img: require("../../public/images/projects/proy/curved_lines_diagonal_pokemon.jpg"),
    link: "/",
    icon: <GithubIcon className="w-5 ml-1" />,
    iconWeb: "https://github.com/Vontrauwitz/Pi-Countries-Vontrauwitz",
  },
  {
    type: "Full-Stack Countries & Activities Website APP",
    title: "Countries & Activities Website",
    summary: (
      <div>
        This is an individual project from Bootcamp Henry, that uses an API (Restcountries) that brings data from the countries and a section was created so that you can create activities in each country or in several and view them, it allows you to filter and search for countries as well as activities It is a CRUD since it has a Postgres Database and uses Sequelize and Node.js in the backend. The technologies used by this website are: React, React DOM, React Router DOM, Redux, Axios, Node.js, Sequelize, Postgres, etc.
        <strong>(This website is going to be renewed and redeployed applying newer technologies, and changing the UX/UI)</strong>
      </div>
    ),
    img: require("../../public/images/projects/proy/cricle_blue_countries.jpg"),
    link: "/",
    icon: <GithubIcon className="w-5 ml-1" />,
    iconWeb: "https://github.com/Vontrauwitz/Pi-Countries-Vontrauwitz",
  },
  {
    type: "Full-Stack Recipes Website FullStack APP",
    title: "Food APP Website",
    summary: (
      <div>
        This is an individual project from Bootcamp Henry, that uses an API (Spoonacular) that brings recipe data. Here you can create your own ones as well as see the API ones and you can filter it by recipe names or by pre-established diets. It is a CRUD since it has a Postgres Database and uses Sequelize and Node.js in the backend. The technologies used by this website are: React, React DOM, React Router DOM, Redux, Axios, Node.js, Sequelize, Postgres, etc.
        <strong>(This website is going to be renewed and redeployed applying newer technologies, and changing the UX/UI)</strong>
      </div>
    ),
    img: require("../../public/images/projects/proy/plate_sun_food.jpg"),
    link: "/",
    icon: <GithubIcon className="w-5 ml-1" />,
    iconWeb: "https://github.com/Vontrauwitz/PI-Food",
  },
]

// this website is going to be renewed and redeployed

// export const project = [
//   {
//  type: "E-Commerce Website",
// title: "Mercado Agave",
//   summary: "Built a web app using React, Redux, Axios, CSS Modules, and a fake API store for back-end. Deployed on Vercel. The website features a list of products(cards), a product detail component, an upper navigation bar, a menu of categories, and shopping cart logic with local storage.",
//     img: require("../../public/images/projects/proy/ondasagave.jpg"),
//       link: "https://mercadoagave.vercel.app/",
//         icon: <GithubIcon className="w-5 ml-1" />,
//           iconWeb: "https://github.com/Vontrauwitz/mercadoagave",
//   },
//   {
  // type: "E-Commerce Website",
  // title: "Mercado Agave",
  //   summary: "Built a web app using React, Redux, Axios, CSS Modules, and a fake API store for back-end. Deployed on Vercel. The website features a list of products(cards), a product detail component, an upper navigation bar, a menu of categories, and shopping cart logic with local storage.",
  //     img: require("../../public/images/projects/proy/ondasagave.jpg"),
  //       link: "https://mercadoagave.vercel.app/",
  //         icon: <GithubIcon className="w-5 ml-1" />,
            // iconWeb: "https://github.com/Vontrauwitz/mercadoagave",
//   },
// ]


import { AwsIcon, BlenderIcon, BootstrapIcon, ChakraUiIcon, CssIcon, ExpressIcon, FigmaIcon, GitIcon, GitLabIcon, GithubIcon, GraphQLIcon, HerokuIcon, HtmlIcon, JavaIcon, JsIcon, MaterialUiIcon, MongoDbIcon, MongooseIcon, MySqlIcon, NextJsIcon, NodeJsIcon, PhotoshopIcon, PhpIcon, PostgreSqlIcon, PostmanIcon, ReactIcon, ReduxIcon, SeoIcon, SequelizeIcon, SpringBootIcon, TailwindIcon, TypeScriptIcon, VercelIcon, WebpackIcon } from "@/components/Icons";
import Image from "next/image";

export const frontend = [
  {
    name: "Java Script",
    link: "/",
    description: "Is a popular programming language used for creating interactive web pages and web applications.",
    icon: <JsIcon className="w-5 ml-1" />
  },
  {
    name: "React JS",
    link: "/",
    description: "Is a JavaScript library used for building user interfaces for single - page applications.It allows for the creation of reusable UI components.",
    icon: <ReactIcon className="w-5 ml-1" />
  },
  {
    name: "Next JS",
    link: "/",
    description: "Is a framework built on top of ReactJS that provides server- side rendering, static site generation, and other advanced features for building web applications.",
    icon: <NextJsIcon className="w-5 ml-1" />
  },
  {
    name: "Redux",
    link: "/",
    description: "Is a predictable state management library for JavaScript applications.It is commonly used with React to manage the global state of an application.",
    icon: <ReduxIcon className="w-5 ml-1" />
  },
  {
    name: "Tailwind",
    link: "/",
    description: "Is a utility- first CSS framework that provides a set of pre - defined classes to rapidly build custom user interfaces.",
    icon: <TailwindIcon className="w-5 ml-1" />
  },
  {
    name: "Chakra UI",
    link: "/",
    description: "Is a modular and accessible component library for React applications.It provides a set of customizable and responsive UI components.",
    icon: <ChakraUiIcon className="w-5 ml-1" />
  },
  {
    name: "MUI",
    link: "/",
    description: "(Material - UI) Is a popular React UI framework that implements Google's Material Design guidelines. It offers a wide range of ready-to-use components.",
    icon: <MaterialUiIcon className="w-5 ml-1" />
  },
  {
    name: "Bootstrap",
    link: "/",
    description: "Is a widely- used CSS framework that provides a collection of responsive and mobile - first components and styles for web development.",
    icon: <BootstrapIcon className="w-5 ml-1" />
  },
  {
    name: "React Native",
    link: "/",
    description: "React - Native s a framework for building mobile applications using JavaScript and React.It allows for cross - platform development targeting iOS and Android.",
    icon: <ReactIcon className="w-5 ml-1" />
  },
  {
    name: "Redux Toolkit",
    link: "/",
    description: "Is an opinionated set of utilities and tools that simplifies the process of working with Redux.It provides a standardized way of writing Redux code.",
    icon: <ReduxIcon className="w-5 ml-1" />
  },
  {
    name: "Type Script",
    link: "/",
    description: "Is a statically- typed superset of JavaScript that adds optional type annotations.It helps catch errors and improve code maintainability.",
    icon: <TypeScriptIcon className="w-5 ml-1" />

  },
  {
    name: "Html",
    link: "/",
    description: "Is the standard markup language for creating web pages.",
    icon: <HtmlIcon className="w-5 ml-1" />

  },
  {
    name: "Css",
    link: "/",
    description: "Is used for styling web pages and applications.",
    icon: <CssIcon className="w-5 ml-1" />

  },

];
export const backend = [
  {
    name: "Postgres",
    link: "/",
    description: "Is an open- source relational database management system(RDBMS) known for its robustness, scalability, and adherence to SQL standards.",
    icon: <PostgreSqlIcon className="w-5 ml-1" />
  },
  {
    name: "Mongo DB",
    link: "/",
    description: "Is a NoSQL document database that provides high performance, scalability, and flexibility for storing and querying unstructured data.",
    icon: <MongoDbIcon className="w-3 ml-1" />

  },
  {
    name: "My SQL",
    link: "/",
    description: "Is an open-source relational database management system (RDBMS) widely used for its simplicity, reliability, and performance.",
    icon: <MySqlIcon className="w-5 ml-1" />

  },
  {
    name: "Node js",
    link: "/",
    description: "Is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript code on the server-side, enabling the development of scalable and high-performance web applications.",
    icon: <NodeJsIcon className="w-5 ml-1" />

  },
  {
    name: "Sequelize",
    link: "/",
    description: "Is a promise-based ORM (Object-Relational Mapping) for Node.js that supports multiple databases, including PostgreSQL, MySQL, and SQLite. It simplifies database interactions and provides a set of tools for querying and managing data.",
    icon: <SequelizeIcon className="w-5 ml-1" />

  },
  {
    name: "Mongoose",
    link: "/",
    description: "Is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward and schema-based solution for modeling and interacting with MongoDB documents.",
    icon: <MongooseIcon className="w-5 ml-1" />

  },
  {
    name: "Express",
    link: "/",
    description: "Is a minimal and flexible Node.js web application framework. It allows you to build robust APIs and web applications with features like routing, middleware support, and template rendering",
    icon: <ExpressIcon className="w-5 ml-1" />

  },
  {
    name: "Graph QL",
    link: "/",
    description: "Is a query language and runtime for APIs. It provides a more efficient and flexible approach to data fetching, allowing clients to request specific data structures and reducing over-fetching and under-fetching of data.",
    icon: <GraphQLIcon className="w-5 ml-1" />

  },
  {
    name: "PHP",
    link: "/",
    description: "Is a popular server-side scripting language used for web development. It provides a wide range of features and has a large community supporting various frameworks and libraries.",
    icon: <PhpIcon className="w-4 ml-1" />

  },
  {
    name: "Java",
    link: "/",
    description: "Is a widely-used, general-purpose programming language known for its portability, security, and robustness. It is commonly used for developing enterprise-level applications and Android mobile apps.",
    icon: <JavaIcon className="w-3 ml-1" />

  },
  {
    name: "Spring Boot",
    link: "/",
    description: "Is a Java-based framework that simplifies the development of stand-alone, production-grade Spring applications. It provides a streamlined configuration and development experience for building robust and scalable applications.",
    icon: <SpringBootIcon className="w-3 ml-1" />

  },

];

export const tools = [
  {
    name: "Git",
    link: "/",
    description: "Is a distributed version control system that allows you to track changes in your codebase, collaborate with others, and manage different versions of your project.",
    icon: <GitIcon className="w-5 ml-1" />

  },
  {
    name: "GitHub",
    link: "/",
    description: "Is a web-based platform that provides hosting for Git repositories. It offers features like code collaboration, issue tracking, and pull requests, making it popular among developers for open-source and team-based projects.",
    icon: <GithubIcon className="w-5 ml-1" />

  },
  {
    name: "GitLab",
    link: "/",
    description: "Is a web-based DevOps lifecycle tool that provides a complete set of features for managing the software development process. It includes version control, issue tracking, continuous integration/continuous deployment (CI/CD), and more.",
    icon: <GitLabIcon className="w-5 ml-1" />

  },
  {
    name: "Heroku",
    link: "/",
    description: "Is a cloud platform that allows you to deploy, manage, and scale applications. It supports various programming languages and frameworks, making it easy to deploy your web applications quickly.",
    icon: <HerokuIcon className="w-5 ml-1" />

  },
  {
    name: "Vercel",
    link: "/",
    description: "Is a cloud platform for static sites and serverless functions. It offers seamless deployment and hosting of web applications, providing scalability, performance, and ease of use.",
    icon: <VercelIcon className="w-5.4 ml-1" />

  },
  {
    name: "Netlify",
    link: "/",
    description: "Is a web development platform that offers features like continuous deployment, hosting, and serverless functions. It simplifies the process of deploying and managing static websites and web applications.",

  },
  {
    name: "AWS",
    link: "/",
    description: "(Amazon Web Services) Is a comprehensive cloud computing platform offered by Amazon. It provides a wide range of services, including computing power, storage, databases, networking, and more. AWS offers scalability, security, and flexibility, allowing businesses to build and deploy various types of applications and services in the cloud.",
    icon: <AwsIcon className="w-5 ml-1" />

  },
  {
    name: "VSCode",
    link: "/",
    description: "(Visual Studio Code) Is a popular source code editor developed by Microsoft. It provides a wide range of features, including code highlighting, debugging, and extensions, making it highly customizable and suitable for various programming languages."
  },
  {
    name: "Postman",
    link: "/",
    description: "Is a popular collaboration platform for API development. It allows you to design, test, and document APIs, making it easier to develop and maintain robust API integrations.",
    icon: <PostmanIcon className="w-5 ml-1" />

  },
  {
    name: "Insomnia",
    link: "/",
    description: "Is a powerful API client that helps you design, debug, and test APIs. It provides an intuitive interface for creating requests, organizing APIs, and managing environments, making API development and testing more efficient."
  },
  {
    name: "Webpack",
    link: "/",
    description: "Is a module bundler commonly used in modern web development. It takes modules with dependencies and generates static assets that can be efficiently loaded by the browser, improving performance and optimizing code.",
    icon: <WebpackIcon className="w-5 ml-1" />

  },
  {
    name: "Jest",
    link: "/",
    description: "Is a popular JavaScript testing framework developed by Facebook. It provides a simple and intuitive way to write tests, with features like snapshot testing, mocking, and code coverage analysis."
  },
  {
    name: "Scrum Board",
    link: "/",
    description: "Is a visual tool used in Agile project management. It helps teams track and manage their work using columns representing different stages of the project, such as to-do, in progress, and done."
  },
  {
    name: "SEO",
    link: "/",
    description: "(Search Engine Optimization) Is the practice of optimizing websites to improve their visibility and ranking in search engine results. It involves various techniques and strategies to increase organic traffic and reach a wider audience.",
    icon: <SeoIcon className="w-5 ml-1" />

  },
  {
    name: "IntelliJ",
    link: "/",
    description: "Is a popular integrated development environment (IDE) for Java, Kotlin, and other programming languages. It provides advanced coding assistance, productivity features, and support for various frameworks and technologies."
  },
  {
    name: "Figma",
    link: "/",
    description: "Is a cloud-based design and prototyping tool. It allows designers to collaborate in real-time, create UI designs, and create interactive prototypes. Figma is widely used for its ease of use, collaborative features, and versatility.",
    icon: <FigmaIcon className="w-3 ml-1" />

  },
  {
    name: "Notion",
    link: "/",
    description: "Is an all-in-one workspace and productivity tool. It allows you to create and organize notes, documents, databases, and tasks in a flexible and customizable manner. Notion is popular for its versatility and ability to adapt to various personal and team workflows."
  },
  {
    name: "Photo shop",
    link: "/",
    description: "Is a powerful image editing software developed by Adobe. It is widely used for tasks such as photo retouching, image composition, and graphic design. Photoshop offers a wide range of tools and features for manipulating and enhancing digital images.",
    icon: <PhotoshopIcon className="w-5 ml-1" />

  },
  {
    name: "Dv Resolve",
    link: "/",
    description: "Is a professional video editing and color grading software. It provides advanced editing tools, color correction capabilities, and visual effects. DaVinci Resolve is widely used in the film and television industry for its powerful features and high-quality output."
  },
  {
    name: "Blender",
    link: "/",
    description: "Is a free and open-source 3D creation suite. It is used for tasks such as 3D modeling, animation, rendering, and compositing. Blender offers a robust set of tools and features, making it a popular choice among artists, designers, and animators.",
    icon: <BlenderIcon className="w-5 ml-1" />

  },
  // {
  //   name: "TypeScript",
  //   link: "/",
  //   description: "Is a typed superset of JavaScript that adds static types to the language. It helps catch errors during development, provides better tooling support, and enables developers to write more scalable and maintainable code."
  // },
];


// export const servicios = [
//   // { name: "Nuestros Servicios", link: "/" },
//   { name: "Conocenos", link: "/nosotros" },
// ];

// import { HiPhoneArrowUpRight } from "react-icons/hi2";
// import { AiOutlineWhatsApp } from "react-icons/ai";
//

// export const navigationLinks = [
//   {
//     title: 'Productos',
//     link: '',
//     sublinks: [
//       { title: 'GarantiAuto', link: '/productos' },
//       { title: 'GarantiRevisa', link: '/ServiciosDeRevision' },
//       // { title: 'GarantiPutazos', link: '/producto-3' }
//     ],
//   },
//   { title: 'Nosotros', link: '/nosotros' },
//   { title: '+ 52 (55)33124708', link: 'tel:(55)33124708', icon: <HiPhoneArrowUpRight /> },
//   {
//     title: 'WhatsApp',
//     link: 'https://api.whatsapp.com/send?phone=15533124708',
//     icon: <AiOutlineWhatsApp />
//   },
// ];
// export const servicios = [
//   // { name: "Nuestros Servicios", link: "/" },
//   { name: "Conocenos", link: "/nosotros" },
// ];

// export const garantias = [
//   { name: "Garanti-Auto", link: "/productos" },
//   { name: "revisión", link: "/" },
  // { name: "Movil", link: "/" },
  // { name: "GAP", link: "/" },
// ];

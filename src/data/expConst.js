// Experience content. Plain, JSON-serializable objects only.
// Renamed from the original shape for clarity/future-DB readiness:
//   companyLink -> companyUrl, time -> period, address -> location, work -> description.
// `period` is kept as free text rather than split into start/end dates:
// the source strings mix languages/casing inconsistently (e.g. "Ene" is
// Spanish for January, "aug"/"Nov" are lowercase/mixed English) and
// parsing them into structured dates would risk misreading a date that
// was never entered in a single consistent format.

export const experience = [
  {
    slug: "pilou-full-stack-software-engineer",
    position: "Full Stack Software Engineer",
    company: "Pilou",
    companyUrl: "https://www.pilou.io/",
    period: "Dec 2022 - Ene 2024",
    location: "México City, México",
    description: "As the sole developer in my role, I manage and maintain diverse repositories utilizing technologies such as RoR, Python, React, AWS, and Postgres. I collaborate closely with the landing page team and lead the integration of new, cutting-edge repositories. This involves seamless transitions to ensure uninterrupted customer service. Serving as a vital bridge between management and various hired teams, I offer comprehensive technical support and swiftly address customer issues. I also implement code updates in compliance with evolving regulatory standards and drive enhancements based on emerging requirements. My responsibilities encompass debugging code, refining databases, and optimizing storage solutions, among other tasks.",
  },

  {
    slug: "freelance-web-developer",
    position: "Freelance web developer",
    company: "freelance",
    companyUrl: "https://vontrauwitz-portfolio.vercel.app/",
    period: "May 2022 - Present",
    location: "México City, México",
    description: "I have made pages for clients such as garanitimex, and I have helped in groups that have very large projects.",
  },
  // {
  //   slug: "agave-lab-front-end-developer",
  //   position: "Front-End Developer (Project)",
  //   company: "Agave Lab",
  //   companyUrl: "https://agavelab.com/",
  //   period: "Dic 2022 – Aug 2023",
  //   location: "Guadalajara Jalisco, México",
  //   description: "Collaborate with the team as a Junior Front-End Developer for a project, contributing to the development of web applications.",
  // },
  {
    slug: "henry-full-stack-teaching-assistant",
    position: "Full - Stack Teaching Assistant",
    company: "Henry",
    companyUrl: "https://www.soyhenry.com/",
    period: "Feb 2022 - Jul 2023",
    location: "CABA, Buenos Aires (remote)",
    description: " Coordinate a group of students to achieve integration to the study group. Guide students in the first steps of the course. Assist to solve exercises and promote group collaboration(Pair Programming).Propose ideas to improve the Bootcamp processes.",
  },

  {
    slug: "freelance-accountant-mexico",
    position: "Freelance Accountant, Mexico",
    company: "freelance",
    companyUrl: "https://vontrauwitz-portfolio.vercel.app/",
    period: "aug 2014 - Nov 2022",
    location: "México City, México",
    description: "Operated as an independent public accountant, managing financial records and providing accounting services",
  },
]

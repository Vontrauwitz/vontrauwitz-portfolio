// Education content. Plain, JSON-serializable objects only.
// Renamed from the original shape for clarity/future-DB readiness:
//   type -> program, schoolLink -> institutionUrl, place -> institution,
//   time -> period, info -> description.
// `period` is kept as free text rather than split into start/end dates,
// for the same reason as src/data/expConst.js.

export const education = [
  {
    slug: "henry-bootcamp-full-stack-developer",
    program: "Bootcamp Full Stack Developer",
    institution: "Henry",
    institutionUrl: "https://www.soyhenry.com/",
    period: "May 2022 - Jan 2023",
    description: "Intensive bootcamp of +800 theoretical and practical hours",
  },
  {
    slug: "platzi-full-stack-developer-ongoing",
    program: "Full Stack Developer | Ongoing",
    institution: "Platzi",
    institutionUrl: "https://www.platzi.com",
    period: "jan 2023 - Present ",
    description: "Platzi is an online education platform, where you will find courses focused on 6 areas of knowledge and precisely designed",
  },
  {
    slug: "meta-back-end-developer-professional-certificate-ongoing",
    program: "Meta Back-End Developer Professional Certificate | Ongoing",
    institution: "Coursera And Meta",
    institutionUrl: "https://www.coursera.org/professional-certificates/meta-back-end-developer",
    period: "Aug 2022 - Present",
    description: "Backend course taught by meta people on coursera",
  },
  {
    slug: "ebc-public-accountant",
    program: "Public Accountant",
    institution: "Escuela Bancaria y Comercial",
    institutionUrl: "https://www.ebc.mx/",
    period: "Jan 2009 - Dec 2013 ",
    description: "Traditional Accounting Bachelor's Degree in Escuela Bancaria y Comercial (EBC) in Mexico City ",
  },
  {
    slug: "up-mechatronic-engineering-incomplete",
    program: "Mechatronic Engineering | Incomplete Studies",
    institution: "Universidad Panamericana",
    institutionUrl: "https://www.up.edu.mx/",
    period: "Sep 2006 - Sep 2009",
    description: "While pursuing my Mechatronic Engineering degree at Universidad Panamericana, I had to prioritize work commitments, which led to the program remaining incomplete. However, the foundational education and exposure to engineering principles during this period have significantly contributed to my problem-solving abilities and analytical thinking",
  },
]

// Testimonials content. Plain, JSON-serializable objects only.
// `image` is a root-relative string path into `public/` instead of an
// imported StaticImageData object. Testimonials.js previously rendered
// this <Image> with no explicit width/height at all (it relied entirely
// on the static import's inferred intrinsic size), so `imageWidth` /
// `imageHeight` are now carried alongside the path — next/image requires
// them explicitly once the source is a plain string. All three source
// images are square, so these dimensions don't change the existing
// object-cover/rounded-full visual output.

export const cards = [
  {
    slug: "santiago-miranda",
    title: "Santiago Miranda",
    content: `"Studying with my friend has been an inspiring journey. Their dedication and support have made learning enjoyable and rewarding. Grateful for such a talented and supportive friend in this exciting adventure."`,
    image: "/images/testimonials/santiago.png",
    imageWidth: 392,
    imageHeight: 392,
    profileUrl: "https://www.linkedin.com/in/santiagomiranda0/",
  },
  {
    slug: "lorenzo-vignolo",
    title: "Lorenzo Vignolo",
    content: `"An amazing friend to work with! Impressive work ethic, creativity, and problem-solving skills. Achieved outstanding results together. Looking forward to more successful collaborations!"`,
    image: "/images/testimonials/Lorenzo.png",
    imageWidth: 800,
    imageHeight: 800,
    profileUrl: "https://www.linkedin.com/in/lorenzo-vignolo-prof/",
  },

  {
    slug: "horacio-rodriguez",
    title: "Horacio Rodriguez",
    content: `"An absolute pleasure mentoring you! Your passion for learning and dedication to improvement are truly inspiring. Witnessing your remarkable growth is incredible. Keep up the outstanding work! Eagerly anticipating your continued success!"`,
    image: "/images/testimonials/Horacio.png",
    imageWidth: 460,
    imageHeight: 460,
    profileUrl: "https://www.linkedin.com/in/horacio-cba/",
  },
  // Add more cards here as needed
];

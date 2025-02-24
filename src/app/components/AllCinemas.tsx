// "use client";
// import { useEffect, useState } from "react";
// import { Cinema, fetchCinemasFrontend } from "../util/http";

// export function AllCinemas({
//   myCinemas = [],
//   addCinema = null,
// }: {
//   myCinemas: Cinema[];
//   addCinema: ((arg: Cinema) => void) | null;
// }) {
//   // todo: loading state
//   const [otherCinemas, setOtherCinemas] = useState<
//     Cinema[]
//   >([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const allCinemas = await fetchCinemasFrontend();
//       setOtherCinemas(
//         allCinemas.filter(
//           (cin) =>
//             !myCinemas.some(
//               (c) => c.cinemaId === cin.cinemaId
//             )
//         )
//       );
//     };

//     fetchData();
//   }, [myCinemas]);

//   return (
//     <>
//     </>
//   );
// }

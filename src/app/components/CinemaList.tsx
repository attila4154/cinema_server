import { fetchCinemas } from "../util/http";

export default async function CinemaList() {
  const cinemas = await fetchCinemas();

  return (
    <div>
      <h2 className="text-lg font-bold m-4">All cinemas</h2>
      {cinemas.map((cinema) => (
        <div key={cinema}>{cinema}</div>
      ))}
    </div>
  );
}

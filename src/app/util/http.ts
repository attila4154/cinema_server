export type Cinema = {
  cinemaId: number;
  cinemaName: string;
};

export async function fetchCinemasFrontend() {
  const response = await fetch("/api/cinemas/all");
  const res = (await response.json()) as Cinema[];
  return res;
}

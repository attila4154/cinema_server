export async function fetchCinemasFrontend() {
  const response = await fetch("/api/cinemas");
  const res = await response.json();
  return res;
}

// export async function fetchTodaysScreenings(): Screening[] {

// }

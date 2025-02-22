import { Cinema } from "./http";

export function getCinemasFromLocalStorage(): Cinema[] {
  return JSON.parse(
    window.localStorage.getItem("my_cinemas") || "[]"
  );
}

export function addCinemaToLocalStorage(cinema: Cinema) {
  const cinemas = getCinemasFromLocalStorage();
  window.localStorage.setItem(
    "my_cinemas",
    JSON.stringify([...cinemas, cinema])
  );
}

export function removeCinemaFromLocalStorage(
  cinema: Cinema
) {
  const cinemas = getCinemasFromLocalStorage();
  window.localStorage.setItem(
    "my_cinemas",
    JSON.stringify(cinemas.filter((c) => c.id !== cinema.id))
  );
}

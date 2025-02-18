export function getCinemasFromLocalStorage(): string[] {
  return JSON.parse(
    window.localStorage.getItem("my_cinemas") || "[]"
  );
}

export function addCinemaToLocalStorage(cinema: string) {
  const cinemas = getCinemasFromLocalStorage();
  window.localStorage.setItem(
    "my_cinemas",
    JSON.stringify([...cinemas, cinema])
  );
}

export function removeCinemaFromLocalStorage(
  cinema: string
) {
  const cinemas = getCinemasFromLocalStorage();
  window.localStorage.setItem(
    "my_cinemas",
    JSON.stringify(cinemas.filter((c) => c !== cinema))
  );
}

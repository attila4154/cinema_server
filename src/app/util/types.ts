export type Screening = {
  cinema: string;
  movieScreening: MovieScreening;
};

export type MovieScreening = {
  movie: string;
  screenings: string[];
};

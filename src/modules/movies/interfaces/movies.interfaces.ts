export interface Spokenlanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Productioncountry {
  iso_3166_1: string;
  name: string;
}

export interface Productioncompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Belongstocollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

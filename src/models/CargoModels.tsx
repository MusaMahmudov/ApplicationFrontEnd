export interface getCargo {
  id: string;
  isTaken: boolean;
  miles: null | number;
  pieces: null | number;
  weight: null | number;
  width: null | number;
  length: null | number;
  height: null | number;
  pickUpZipcode: null | string;
  pickUpCity: null | string;
  deliverToZipcode: null | string;
  deliverToCity: null | string;
  notes: null | string;
  newOffers: number;
  bidOnOrder: string;
}
export interface getCargoForDriver {
  id: string;
  isTaken: boolean;
  miles: null | number;
  pieces: null | number;
  weight: null | number;
  width: null | number;
  length: null | number;
  height: null | number;
  pickUpZipcode: null | string;
  deliverToZipcode: null | string;
  pickUpCity: null | string;

  deliverToCity: null | string;

  distanceToDriver: string | null;
  notes: null | string;
  hasOffer: null | boolean;
}
export interface getCargoForOffer {
  id: string;
  miles: string | undefined;
  pieces: string | undefined;
  weight: string | undefined;
  width: string | undefined;
  length: string | undefined;
  height: string | undefined;
  pickUpZipcode: string | undefined;
  deliverToZipcode: string | undefined;
  notes: string | undefined;
}

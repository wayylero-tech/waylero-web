import { redirect } from "next/navigation";

const cityOverrideMap: Record<string, string> = {
  "dubai": "bae",
  "pekin": "cin",
  "tokyo": "japonya",
  "viyana": "avusturya",
  "paris": "fransa",
  "londra": "ingiltere",
  "antalya": "turkiye",
  "hongkong": "cin",
  "bangkok": "tayland",
  "singapur": "singapur",
  "barselona": "ispanya",
  "roma": "italya",
  "mekke": "suudi-arabistan",
  "istanbul": "turkiye",
  "newyork": "amerika",
};

type Props = {
  params: {
    oldRegion: string;
    city: string;
  };
};

export default function OldCityRedirectPage({ params }: Props) {
  const { oldRegion, city } = params;

  const newCountry = cityOverrideMap[city] || oldRegion; 
  const newUrl = `/${newCountry}/${city}`;

  return redirect(newUrl);
}

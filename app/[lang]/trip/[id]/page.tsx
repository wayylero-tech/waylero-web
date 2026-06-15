import TripClient from "./TripClient";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Props {
  params: Promise<{
    lang?: string;
    id: string;
  }>;
}

export default async function TripPage({ params }: Props) {
  const { id, lang } = await params;

  const currentLang = lang === "en" ? "en" : "tr";

  const ref = doc(db, "trips", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return (
      <div>
        {currentLang === "en" ? "Trip not found" : "Trip bulunamadı"}
      </div>
    );
  }

  const data = snap.data();

  // Firestore verisini düz objeye çevir
  const sanitize = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  };

  const trip = {
    ...data,
    id: snap.id,
    createdAt: data.createdAt
      ? data.createdAt.toDate().toISOString()
      : null,
  };

  // Kullanıcının diğer rotalarını çek
  const otherTripsQuery = query(
    collection(db, "trips"),
    where("userId", "==", data.userId),
    limit(4)
  );

  const othersSnap = await getDocs(otherTripsQuery);

  const savedTrips = othersSnap.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt
        ? doc.data().createdAt.toDate().toISOString()
        : null,
    }))
    .filter((t) => t.id !== id);

  return (
    <TripClient
      trip={sanitize({ ...trip, savedTrips })}
      currentLang={currentLang}
    />
  );
}
import TripClient from "./TripClient";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ref = doc(db, "trips", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Trip bulunamadı
      </div>
    );
  }

  const data = snap.data();

  // 🔥 Firestore → safe plain object
  const trip = {
    ...data,
    createdAt: data.createdAt
      ? {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds,
        }
      : null,
  };

  return <TripClient trip={trip} />;
}

import { Suspense } from "react";
import KesfetClient from "./KesfetClient";

export default function KesfetPage() {
  return (
    <Suspense fallback={<div className="p-6">Yükleniyor...</div>}>
      <KesfetClient />
    </Suspense>
  );
}

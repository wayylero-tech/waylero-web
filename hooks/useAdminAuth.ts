"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  getDocs,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

export function useAdminAuth(router: any) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("");
  const [authUsers, setAuthUsers] = useState<any[]>([]);

  const SUPER_ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

  const isSuperAdmin = role === "Süper Admin";
  const isAdmin = role === "Admin" || role === "Süper Admin";
  const isEditor = role === "Editör" || isAdmin;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return router.replace("/login");

      const email = firebaseUser.email?.toLowerCase() ?? "";

      if (email === SUPER_ADMIN_EMAIL) {
        setRole("Süper Admin");
      } else {
        const snap = await getDocs(
          query(collection(db, "authorized_users"))
        );

        const found = snap.docs.find(
          (d) => d.data().email === email
        );

        if (!found) return router.replace("/");

        setRole(found.data().role);
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    const unsubList = onSnapshot(
      query(collection(db, "authorized_users")),
      (snap) => {
        setAuthUsers(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }))
        );
      }
    );

    return () => {
      unsub();
      unsubList();
    };
  }, [router, SUPER_ADMIN_EMAIL]);

  // 🔐 Yetki ekleme
  const handleAddAuth = async () => {
    const emailInput = document.getElementById(
      "newAdminEmail"
    ) as HTMLInputElement;

    const roleSelect = document.getElementById(
      "roleSelect"
    ) as HTMLSelectElement;

    const email = emailInput.value.toLowerCase().trim();

    if (!email) return alert("Mail gir");

    await setDoc(doc(db, "authorized_users", email), {
      email,
      role: roleSelect.value,
      addedBy: user?.email ?? null,
      addedAt: Date.now()
    });

    emailInput.value = "";
  };

  // 🗑️ silme
  const handleDeleteAuth = async (id: string) => {
    await deleteDoc(doc(db, "authorized_users", id));
  };

  return {
    loading,
    user,
    role,
    authUsers,
    SUPER_ADMIN_EMAIL,
    handleAddAuth,
    handleDeleteAuth,
    isSuperAdmin,
    isAdmin,
    isEditor,
  };
}
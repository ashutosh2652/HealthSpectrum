import { useEffect, useState } from "react";

type User = {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  imageUrl: string;
  createdAt: string;
  lastLoginAt?: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user profile");
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div>
      <h2>User Info (from backend)</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

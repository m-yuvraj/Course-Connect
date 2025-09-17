import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {data.user.username} 👋</h1>

      <section className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold">Saved Resources</h2>
          <p className="text-xl">{data.stats.savedResources}</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <ul className="list-disc ml-5">
          {data.recentActivities.map((act: any) => (
            <li key={act.id}>
              {act.action} – {new Date(act.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Recommended Resources</h2>
        <div className="grid grid-cols-3 gap-4">
          {data.recommended.map((res: any) => (
            <div key={res.id} className="p-3 bg-white border rounded shadow">
              <h3 className="font-medium">{res.title}</h3>
              <p className="text-sm">{res.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

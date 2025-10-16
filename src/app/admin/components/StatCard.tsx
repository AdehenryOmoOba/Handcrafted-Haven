export default function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800 mt-2">{value}</p>
    </div>
  );
}

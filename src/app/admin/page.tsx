import StatCard from './components/StatCard';
import { query } from '@/lib/db';

export default async function AdminPage() {
  const users = await query('SELECT COUNT(*) FROM users');
  const artisans = await query("SELECT COUNT(*) FROM users WHERE role = 'artisan'");
  const products = await query('SELECT COUNT(*) FROM products');

  return (
     <div className="min-h-screen bg-light-gray">
      <h1>Adminstrator Dashboard</h1>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard title="Total Users" value={users.rows[0].count} />
      <StatCard title="Artisans" value={artisans.rows[0].count} />
      <StatCard title="Products" value={products.rows[0].count} />
    </div>
    </div>
  );
}

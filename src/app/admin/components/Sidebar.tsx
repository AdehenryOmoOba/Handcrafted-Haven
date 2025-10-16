'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/artisans', label: 'Artisans' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/support', label: 'Support' },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 text-xl font-bold text-gray-800">Handcrafted Haven</div>
      <nav className="flex flex-col space-y-2 p-4">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 ${
              path === link.href ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

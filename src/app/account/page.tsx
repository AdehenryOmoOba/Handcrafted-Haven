import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pure-white rounded-2xl shadow-card p-8">
          <h1 className="font-serif text-3xl font-bold text-deep-forest mb-6">
            My Account
          </h1>

          <div className="space-y-6">
            {/* User Info Section */}
            <div className="border-b border-charcoal/20 pb-6">
              <h2 className="text-xl font-semibold text-deep-forest mb-4">
                Account Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-charcoal">Name</label>
                  <p className="text-lg text-deep-forest">{session.user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Email</label>
                  <p className="text-lg text-deep-forest">{session.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal">Role</label>
                  <p className="text-lg text-deep-forest capitalize">{session.user.role}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-deep-forest mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/products"
                  className="p-4 border border-charcoal/20 rounded-lg hover:bg-cream transition-colors"
                >
                  <h3 className="font-semibold text-deep-forest mb-1">Browse Products</h3>
                  <p className="text-sm text-charcoal">Discover handcrafted items</p>
                </Link>
                <Link
                  href="/cart"
                  className="p-4 border border-charcoal/20 rounded-lg hover:bg-cream transition-colors"
                >
                  <h3 className="font-semibold text-deep-forest mb-1">View Cart</h3>
                  <p className="text-sm text-charcoal">Check your shopping cart</p>
                </Link>
                {session.user.role === 'artisan' && (
                  <Link
                    href="/dashboard"
                    className="p-4 border border-primary/20 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <h3 className="font-semibold text-primary mb-1">Artisan Dashboard</h3>
                    <p className="text-sm text-charcoal">Manage your products</p>
                  </Link>
                )}
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-sage-green/10 border border-sage-green/20 rounded-lg p-6">
              <h3 className="font-semibold text-deep-forest mb-2">
                Welcome, {session.user.name?.split(' ')[0]}! 👋
              </h3>
              <p className="text-charcoal">
                {session.user.role === 'artisan' 
                  ? 'Thank you for being part of our artisan community. Start managing your products from your dashboard.'
                  : 'Thank you for joining Handcrafted Haven. Explore unique handmade items from talented artisans.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

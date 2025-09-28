import Link from 'next/link';
import { artisanProfiles } from '@/lib/placeholder-data';

export default function ArtisansPage() {
  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-deep-forest mb-4">
            Meet Our Artisans
          </h1>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">
            Discover the talented creators behind our unique handcrafted treasures. Each artisan brings their own story, passion, and expertise to every piece.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {artisanProfiles.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-pure-white rounded-2xl shadow-card hover:shadow-xl transition-shadow duration-200 p-8 flex flex-col items-center text-center border border-soft-gray"
            >
              <div className="w-24 h-24 bg-sage-green rounded-full flex items-center justify-center mb-5 shadow-md border-4 border-cream">
                <span className="text-4xl text-pure-white font-serif font-bold">
                  {artisan.business_name.charAt(0)}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-semibold text-primary mb-1">
                {artisan.business_name}
              </h2>
              <div className="text-medium-gray text-xs mb-2">
                {artisan.years_experience} years experience
              </div>
              <p className="text-charcoal text-sm mb-4 min-h-[60px]">
                {artisan.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {artisan.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="bg-cream border border-sage-green text-sage-green rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 justify-center mb-4">
                {artisan.website_url && (
                  <a
                    href={artisan.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Website"
                    className="hover:text-accent text-accent"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13zm0-12A5.5 5.5 0 1010 15.5 5.5 5.5 0 0010 2.5zm0 1a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"/></svg>
                  </a>
                )}
                {artisan.instagram_handle && (
                  <a
                    href={`https://instagram.com/${artisan.instagram_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-accent text-accent"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281H7.721c-.49 0-.875.385-.875.875v8.958c0 .49.385.875.875.875h8.558c.49 0 .875-.385.875-.875V8.582c0-.49-.385-.875-.875-.875z"/></svg>
                  </a>
                )}
                {artisan.facebook_url && (
                  <a
                    href={artisan.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-accent text-accent"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
              </div>
              <Link
                href={`/artisans/${artisan.id}`}
                className="mt-auto px-6 py-2 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors duration-200 font-medium text-sm shadow-md"
                aria-label={`View profile for ${artisan.business_name}`}
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

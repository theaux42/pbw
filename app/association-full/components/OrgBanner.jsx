export default function OrgBanner({ bannerUrl }) {
  if (!bannerUrl) return null;
  
  return (
    <div className="relative w-full h-56 md:h-72 lg:h-80 rounded-3xl overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
      <img
        src={bannerUrl}
        alt="Banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

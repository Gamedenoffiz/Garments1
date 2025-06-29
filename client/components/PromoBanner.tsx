export default function PromoBanner() {
  const promoMessages = [
    "🎉 Get 10% off on all Leggings - All Colors Available!",
    "🚚 Free Shipping above ₹599 - Shop Now!",
    "💝 Buy 2 Get 1 Free on Selected T-Shirts",
    "✨ New Arrivals: Night Wear Collection",
    "🎁 Cash on Delivery Available - 100% Secure",
  ];

  return (
    <div className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] h-[46px] flex items-center justify-center overflow-hidden">
      <div className="flex animate-scroll">
        {promoMessages.concat(promoMessages).map((message, index) => (
          <div key={index} className="flex-shrink-0 px-8">
            <span className="text-white text-sm font-normal leading-[26.25px]">
              {message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

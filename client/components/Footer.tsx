import { Instagram, Twitter, Facebook, MapPin } from "lucide-react";

export default function Footer() {
  const companyLinks = [
    "Search",
    "Delivery Information",
    "Contact Us",
    "Return My Order",
    "Store Locations",
  ];

  const policyLinks = [
    "Privacy Policy",
    "Terms & Conditions",
    "Return & Replacement Policy",
  ];

  const scrollingText = "Free Delivery above order value ₹700";

  return (
    <footer className="bg-[#111] text-white">
      {/* Scrolling Banner */}
      <div className="bg-white py-2.5 overflow-hidden">
        <div className="flex animate-scroll">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <span className="text-[#111] text-[11px] font-semibold px-12">
                {scrollingText}
              </span>
              <div className="w-3 h-3 border border-[#111] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-[#333] pt-25 pb-8">
        <div className="max-w-[1470px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Head Office */}
            <div className="space-y-4">
              <h3 className="text-white text-[12px] font-semibold leading-[15.6px]">
                Head Office
              </h3>

              <div className="space-y-4">
                <div className="w-[90px] h-[90px]">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F19caebe7de7b47ab8a6c24158562cc25%2F974cd8fe2806421093683de9d3f16b82"
                    alt="Indian Flower Logo"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 max-w-[330px]">
                  <p className="text-[#999] text-[15px] leading-[26.25px]">
                    INDIAN FLOWER
                    <br />
                    M/s.Srinithi Garment
                    <br />
                    8/626B, Angeripalayam Road,
                    <br />
                    Tiruppur, TamilNadu,
                    <br />
                    India Pin-641603
                  </p>

                  <div className="space-y-1">
                    <p className="text-[#999] text-[15px] leading-8">
                      +91 6380044008
                    </p>
                    <p className="text-[#999] text-[15px] leading-8">
                      support@indianflower.com
                    </p>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-3">
                  <button className="w-9 h-9 border border-[#999] rounded-full flex items-center justify-center hover:border-white transition-colors">
                    <Instagram className="w-4 h-4 text-[#999] hover:text-white" />
                  </button>
                  <button className="w-9 h-9 border border-[#999] rounded-full flex items-center justify-center hover:border-white transition-colors">
                    <Twitter className="w-4 h-4 text-[#999] hover:text-white" />
                  </button>
                  <button className="w-9 h-9 border border-[#999] rounded-full flex items-center justify-center hover:border-white transition-colors">
                    <Facebook className="w-4 h-4 text-[#999] hover:text-white" />
                  </button>
                  <button className="w-9 h-9 border border-[#999] rounded-full flex items-center justify-center hover:border-white transition-colors">
                    <MapPin className="w-4 h-4 text-[#999] hover:text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-white text-[12px] font-semibold leading-[15.6px]">
                Company
              </h3>
              <ul className="space-y-2.5">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-[#999] text-[14px] leading-[26.25px] capitalize hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policy */}
            <div className="space-y-4">
              <h3 className="text-white text-[12px] font-semibold leading-[15.6px]">
                Policy
              </h3>
              <ul className="space-y-2.5">
                {policyLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-[#999] text-[14px] leading-[26.25px] capitalize hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-white text-[12px] font-semibold leading-[15.6px]">
                Signup for Newsletter
              </h3>

              <div className="space-y-8">
                <p className="text-[#999] text-[14px] leading-[26.25px]">
                  Enter your email address for updated information on Sales and
                  Offers.
                </p>

                <form className="flex rounded-[5px] overflow-hidden">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    className="flex-1 h-[50px] px-5 bg-transparent border border-[#333] rounded-l-[30px] text-[#999] text-[12px] placeholder-[#999] focus:outline-none focus:border-[#555]"
                  />
                  <button
                    type="submit"
                    className="bg-white text-[#111] px-10 py-3.5 text-[10px] font-semibold uppercase rounded-r-[30px] hover:bg-[#f5f5f5] transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#333] py-8">
        <div className="max-w-[1470px] mx-auto px-8">
          <p className="text-[#999] text-[14px] leading-[26.25px]">
            © 2025 Indian Flower. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

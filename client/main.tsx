import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import ProductsViewPage from "./pages/ProductsViewPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";

// Import dedicated category pages
import TShirtsPage from "./pages/TShirtsPage";
import RoundNeckTShirtsPage from "./pages/RoundNeckTShirtsPage";
import VNeckTShirtsPage from "./pages/VNeckTShirtsPage";
import PoloTShirtsPage from "./pages/PoloTShirtsPage";
import LongSleeveTShirtsPage from "./pages/LongSleeveTShirtsPage";
import SleevelessTShirtsPage from "./pages/SleevelessTShirtsPage";
import FullHandTShirtsPage from "./pages/FullHandTShirtsPage";
import TrackPantsPage from "./pages/TrackPantsPage";
import ShortsPage from "./pages/ShortsPage";
import LeggingsPage from "./pages/LeggingsPage_updated";
import FlatAnkleLeggingsPage from "./pages/FlatAnkleLeggingsPage";
import FlatFullLengthLeggingsPage from "./pages/FlatFullLengthLeggingsPage";
import ChuridharAnkleLeggingsPage from "./pages/ChuridharAnkleLeggingsPage";
import ChuridharFullLengthLeggingsPage from "./pages/ChuridharFullLengthLeggingsPage";
import ShimmerLeggingsPage from "./pages/ShimmerLeggingsPage";
import ThreeFourLeggingsPage from "./pages/ThreeFourLeggingsPage";
import SareeShapewearPage from "./pages/SareeShapewearPage";
import LycraCottonShapewearPage from "./pages/LycraCottonShapewearPage";
import PolyesterShapewearPage from "./pages/PolyesterShapewearPage";
import ShimmerShapewearPage from "./pages/ShimmerShapewearPage";
import NightWearPage from "./pages/NightWearPage";
import NightTShirtsPage from "./pages/NightTShirtsPage";
import InnerWearPage from "./pages/InnerWearPage";
import WomenShortsPage from "./pages/WomenShortsPage";
import BasicSlipsPage from "./pages/BasicSlipsPage";
import AdjustmentSlipsPage from "./pages/AdjustmentSlipsPage";
import PantiesPage from "./pages/PantiesPage";
import AboutPage from "./pages/AboutPage";
import HotSalesPage from "./pages/HotSalesPage";
import ContactPage from "./pages/ContactPage";
import StoreLocationsPage from "./pages/StoreLocationsPage";
import SizeGuidePage from "./pages/SizeGuidePage";
import TrackOrderPage from "./pages/TrackOrderPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import ReturnsPage from "./pages/ReturnsPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentsPage from "./pages/PaymentsPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/products/:category?" element={<ProductsPage />} />
            <Route path="/all-products" element={<ProductsViewPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            
            {/* Category Routes - Using dedicated pages */}
            <Route path="/category/men" element={<CategoryPage />} />
            <Route path="/category/women" element={<CategoryPage />} />
            <Route path="/category/t-shirts" element={<TShirtsPage />} />
            <Route path="/category/round-neck-t-shirts" element={<RoundNeckTShirtsPage />} />
            <Route path="/category/v-neck-t-shirts" element={<VNeckTShirtsPage />} />
            <Route path="/category/polo-t-shirts" element={<PoloTShirtsPage />} />
            <Route path="/category/long-sleeve-t-shirts" element={<LongSleeveTShirtsPage />} />
            <Route path="/category/sleeveless-t-shirts" element={<SleevelessTShirtsPage />} />
            <Route path="/category/full-hand-t-shirts" element={<FullHandTShirtsPage />} />
            <Route path="/category/track-pants" element={<TrackPantsPage />} />
            <Route path="/category/shorts" element={<ShortsPage />} />
            <Route path="/category/leggings" element={<LeggingsPage />} />
            <Route path="/category/flat-ankle-leggings" element={<FlatAnkleLeggingsPage />} />
            <Route path="/category/flat-full-length-leggings" element={<FlatFullLengthLeggingsPage />} />
            <Route path="/category/churidhar-ankle-leggings" element={<ChuridharAnkleLeggingsPage />} />
            <Route path="/category/churidhar-full-length-leggings" element={<ChuridharFullLengthLeggingsPage />} />
            <Route path="/category/shimmer-leggings" element={<ShimmerLeggingsPage />} />
            <Route path="/category/saree-shapewear" element={<SareeShapewearPage />} />
            <Route path="/category/lycra-cotton-shapewear" element={<LycraCottonShapewearPage />} />
            <Route path="/category/polyester-shapewear" element={<PolyesterShapewearPage />} />
            <Route path="/category/shimmer-shapewear" element={<ShimmerShapewearPage />} />
            <Route path="/category/night-wear" element={<NightWearPage />} />
            <Route path="/category/night-t-shirts" element={<NightTShirtsPage />} />
            <Route path="/category/inner-wear" element={<InnerWearPage />} />
            <Route path="/category/3-4-leggings" element={<ThreeFourLeggingsPage />} />
            <Route path="/category/women-shorts" element={<WomenShortsPage />} />
            <Route path="/category/basic-slips" element={<BasicSlipsPage />} />
            <Route path="/category/adjustment-slips" element={<AdjustmentSlipsPage />} />
            <Route path="/category/panties" element={<PantiesPage />} />
            
            {/* Footer Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/hot-sales" element={<HotSalesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/stores" element={<StoreLocationsPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/return-policy" element={<ReturnsPage />} />
            <Route path="/refund-policy" element={<ReturnsPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
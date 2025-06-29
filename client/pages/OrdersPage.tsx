import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  X, 
  Eye,
  Calendar,
  CreditCard,
  MapPin
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  payment_status: "pending" | "paid" | "failed";
  payment_method: string;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
  };
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            name,
            price,
            quantity,
            size,
            image
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedOrders = data?.map((order: any) => ({
        ...order,
        items: order.order_items || [],
      })) || [];

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filterOrders = (status: string) => {
    if (status === "all") return orders;
    return orders.filter(order => order.status === status);
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Placed";
      case "confirmed":
        return "Order Confirmed";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <Badge className={`${getStatusColor(order.status)} mb-2`}>
              <span className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                {getOrderStatusText(order.status)}
              </span>
            </Badge>
            <p className="text-lg font-semibold">₹{order.total_amount.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    Size: {item.size} | Qty: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold">₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="flex items-center justify-center text-gray-500 text-sm">
                +{order.items.length - 3} more items
              </div>
            )}
          </div>

          {/* Order Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                {order.payment_method.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {order.shipping_address.city}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(order)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
              {order.status === "delivered" && (
                <Button size="sm">Reorder</Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="space-y-4">
                {filterOrders(status).length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {status === "all" ? "" : status} orders found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {status === "all" 
                          ? "You haven't placed any orders yet."
                          : `You don't have any ${status} orders.`
                        }
                      </p>
                      <Link to="/">
                        <Button>Continue Shopping</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  filterOrders(status).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Order Information</h3>
                    <p><span className="text-gray-600">Order Number:</span> #{selectedOrder.order_number}</p>
                    <p><span className="text-gray-600">Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    <p><span className="text-gray-600">Status:</span> {getOrderStatusText(selectedOrder.status)}</p>
                    <p><span className="text-gray-600">Payment:</span> {selectedOrder.payment_method.toUpperCase()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p>{selectedOrder.shipping_address.name}</p>
                    <p>{selectedOrder.shipping_address.street}</p>
                    <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}</p>
                    <p>{selectedOrder.shipping_address.postal_code}</p>
                    <p>{selectedOrder.shipping_address.phone}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-600">Size: {item.size}</p>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrdersPage;

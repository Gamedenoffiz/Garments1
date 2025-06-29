import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit2, Save, X, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAddresses();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        // If profile doesn't exist, create one
        if (error.code === "PGRST116") {
          await createProfile();
        }
      } else {
        setProfile(data);
        setEditForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          postal_code: data.address?.postal_code || "",
          country: data.address?.country || "India",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            id: user?.id,
            email: user?.email,
            first_name: user?.user_metadata?.first_name || "",
            last_name: user?.user_metadata?.last_name || "",
            phone: "",
            date_of_birth: "",
            address: {
              street: "",
              city: "",
              state: "",
              postal_code: "",
              country: "India",
            },
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user?.id)
        .order("is_default", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          date_of_birth: editForm.date_of_birth,
          address: {
            street: editForm.street,
            city: editForm.city,
            state: editForm.state,
            postal_code: editForm.postal_code,
            country: editForm.country,
          },
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleUpdateProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="first_name"
                        value={editForm.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile?.first_name || "Not set"}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="last_name"
                        value={editForm.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile?.last_name || "Not set"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <p className="text-gray-900">{profile?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-gray-900">{profile?.phone || "Not set"}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={editForm.date_of_birth}
                        onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {profile?.date_of_birth 
                          ? new Date(profile.date_of_birth).toLocaleDateString()
                          : "Not set"
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      {isEditing ? (
                        <Input
                          id="street"
                          value={editForm.street}
                          onChange={(e) => handleInputChange("street", e.target.value)}
                          placeholder="Enter your street address"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile?.address?.street || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={editForm.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Enter your city"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile?.address?.city || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      {isEditing ? (
                        <Input
                          id="state"
                          value={editForm.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          placeholder="Enter your state"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile?.address?.state || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Postal Code</Label>
                      {isEditing ? (
                        <Input
                          id="postal_code"
                          value={editForm.postal_code}
                          onChange={(e) => handleInputChange("postal_code", e.target.value)}
                          placeholder="Enter your postal code"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile?.address?.postal_code || "Not set"}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      {isEditing ? (
                        <Input
                          id="country"
                          value={editForm.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                          placeholder="Enter your country"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile?.address?.country || "Not set"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No saved addresses yet</p>
                    <Button className="mt-4" variant="outline">
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{address.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.street}, {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            {address.is_default && (
                              <span className="inline-block mt-2 px-2 py-1 text-xs bg-[#7C3AED] text-white rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;

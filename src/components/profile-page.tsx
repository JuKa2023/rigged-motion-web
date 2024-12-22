import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserBid {
  id: string;
  amount: number;
  created_at: string;
  auction: {
    title: string;
    current_price: number;
    end_time: string;
  };
  is_winning: boolean;
}

interface UserDimensions {
  length: number;
  width: number;
  height: number;
  created_at: string;
}

export function ProfilePageComponent() {
  const [userBids, setUserBids] = useState<UserBid[]>([]);
  const [dimensions, setDimensions] = useState<UserDimensions | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUser(user);

        // Fetch user's dimensions
        const { data: dimensionsData } = await supabase
          .from('product_dimensions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (dimensionsData) {
          setDimensions(dimensionsData);
        }

        // Fetch user's bids with auction details
        const { data: bidsData } = await supabase
          .from('bids')
          .select(`
            id,
            amount,
            created_at,
            auction:auctions (
              title,
              current_price,
              end_time
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bidsData) {
          // Process bids to determine if they're winning bids
          const processedBids = bidsData.map(bid => ({
            ...bid,
            is_winning: bid.auction.current_price === bid.amount
          }));
          setUserBids(processedBids);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a001f] flex items-center justify-center">
        <div className="text-white">Laden...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a001f]">
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1E4959]/30 via-[#0a001f]/60 to-[#DBD2A4]/20"
        style={{ mixBlendMode: 'color-dodge' }}
      />

      <main className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-[#1E4959]">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-[#1E4959] text-white text-2xl">
                {user?.email?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.email}
              </h1>
              <p className="text-[#DBD2A4]">
                Mitglied seit {new Date(user?.created_at).toLocaleDateString('de-CH')}
              </p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="bids" className="space-y-6">
          <TabsList className="bg-black/20 border border-[#1E4959]/30">
            <TabsTrigger 
              value="bids"
              className="data-[state=active]:bg-[#1E4959] data-[state=active]:text-white"
            >
              Meine Gebote
            </TabsTrigger>
            <TabsTrigger 
              value="dimensions"
              className="data-[state=active]:bg-[#1E4959] data-[state=active]:text-white"
            >
              Produktabmessungen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bids">
            <Card className="bg-black/20 border-[#1E4959]/30 p-6">
              <h2 className="text-xl font-semibold text-[#DBD2A4] mb-4">Gebotshistorie</h2>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {userBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="bg-black/40 rounded-lg p-4 border border-[#1E4959]/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-white font-medium">{bid.auction.title}</h3>
                          <p className="text-sm text-gray-400">
                            {formatDateTime(bid.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">
                            CHF {bid.amount.toLocaleString()}
                          </p>
                          {bid.is_winning && (
                            <Badge className="bg-green-500/10 text-green-400">
                              Höchstgebot
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Auktion endet am: {formatDateTime(bid.auction.end_time)}
                      </div>
                    </div>
                  ))}
                  {userBids.length === 0 && (
                    <p className="text-center text-gray-400 py-8">
                      Sie haben noch keine Gebote abgegeben.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="dimensions">
            <Card className="bg-black/20 border-[#1E4959]/30 p-6">
              <h2 className="text-xl font-semibold text-[#DBD2A4] mb-4">Ihre Produktabmessungen</h2>
              {dimensions ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/40 rounded-lg p-4 border border-[#1E4959]/30">
                      <p className="text-[#DBD2A4] text-sm mb-1">Länge</p>
                      <p className="text-2xl font-bold text-white">{dimensions.length} cm</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-[#1E4959]/30">
                      <p className="text-[#DBD2A4] text-sm mb-1">Breite</p>
                      <p className="text-2xl font-bold text-white">{dimensions.width} cm</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-[#1E4959]/30">
                      <p className="text-[#DBD2A4] text-sm mb-1">Höhe</p>
                      <p className="text-2xl font-bold text-white">{dimensions.height} cm</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Festgelegt am: {formatDateTime(dimensions.created_at)}
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">
                  Sie haben noch keine Produktabmessungen festgelegt.
                </p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 
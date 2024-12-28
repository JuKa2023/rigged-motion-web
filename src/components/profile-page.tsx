import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Package2, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuctionDetails {
  id: string;
  title: string;
  current_price: number;
  end_time: string;
}

interface Bid {
  id: string;
  amount: number;
  created_at: string;
  auction: AuctionDetails;
}

interface Preference {
  id: string;
  length: number;
  width: number;
  height: number;
  product_vision: string;
  created_at: string;
  auction: AuctionDetails;
}

interface GroupedAuctionData {
  auctionId: string;
  title: string;
  currentPrice: number;
  endTime: string;
  bids: {
    id: string;
    amount: number;
    created_at: string;
  }[];
  preference?: {
    length: number;
    width: number;
    height: number;
    product_vision: string;
    created_at: string;
  };
}

const AuctionHistoryCard = ({ auction, isExpanded, onToggle }: {
  auction: GroupedAuctionData;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isActive = new Date(auction.endTime) > new Date();

  return (
    <Card className="bg-black/40 border-[#DBD2A4]/20 p-4 space-y-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${isActive ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
            <Timer className={isActive ? 'text-green-400' : 'text-gray-400'} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#DBD2A4]">{auction.title}</h3>
            <p className="text-sm text-gray-400">
              {isActive ? 'Aktiv bis' : 'Beendet am'} {formatDateTime(auction.endTime)}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Separator className="my-4" />
            
            {auction.preference && (
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Package2 className="text-[#DBD2A4]" />
                  <h4 className="text-md font-medium text-[#DBD2A4]">Produktdetails</h4>
                </div>
                <Card className="bg-black/20 border-[#DBD2A4]/10 p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Länge</p>
                      <p className="text-lg font-medium text-white">{auction.preference.length} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Breite</p>
                      <p className="text-lg font-medium text-white">{auction.preference.width} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Höhe</p>
                      <p className="text-lg font-medium text-white">{auction.preference.height} cm</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Produktvision</p>
                    <p className="text-white mt-1 whitespace-pre-wrap break-words">
                      {auction.preference.product_vision}
                    </p>
                  </div>
                </Card>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-md font-medium text-[#DBD2A4]">Gebote</h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {auction.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-[#DBD2A4]/10"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={bid.amount === auction.currentPrice ? "bg-green-500/10 text-green-400" : ""}
                        >
                          {bid.amount === auction.currentPrice ? "Höchstgebot" : "Gebot"}
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          {formatDateTime(bid.created_at)}
                        </span>
                      </div>
                      <span className="text-lg font-medium text-white">
                        CHF {bid.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export function ProfilePageComponent() {
  const [user, setUser] = useState<User | null>(null);
  const [auctions, setAuctions] = useState<GroupedAuctionData[]>([]);
  const [expandedAuctionId, setExpandedAuctionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      // Fetch bids with auction details
      const { data: bidsData } = await supabase
        .from("bids")
        .select(`
          id,
          amount,
          created_at,
          auction:auctions (
            id,
            title,
            current_price,
            end_time
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch preferences with auction details
      const { data: preferencesData } = await supabase
        .from("user_auction_preferences")
        .select(`
          id,
          length,
          width,
          height,
          product_vision,
          created_at,
          auction:auctions (
            id,
            title,
            current_price,
            end_time
          )
        `)
        .eq("user_id", user.id);

      // Group data by auction
      const auctionMap = new Map<string, GroupedAuctionData>();

      // First, add all auctions from preferences
      if (preferencesData) {
        (preferencesData as any as Preference[]).forEach((pref) => {
          if (!pref.auction) return;

          const auctionId = pref.auction.id;
          auctionMap.set(auctionId, {
            auctionId,
            title: pref.auction.title,
            currentPrice: pref.auction.current_price || 0,
            endTime: pref.auction.end_time || new Date().toISOString(),
            bids: [],
            preference: {
              length: pref.length,
              width: pref.width,
              height: pref.height,
              product_vision: pref.product_vision,
              created_at: pref.created_at,
            },
          });
        });
      }

      // Then add bids to existing auctions or create new ones
      if (bidsData) {
        (bidsData as any as Bid[]).forEach((bid) => {
          if (!bid.auction) return;

          const auctionId = bid.auction.id;
          if (!auctionMap.has(auctionId)) {
            auctionMap.set(auctionId, {
              auctionId,
              title: bid.auction.title,
              currentPrice: bid.auction.current_price,
              endTime: bid.auction.end_time,
              bids: [],
            });
          }

          const auction = auctionMap.get(auctionId)!;
          auction.bids.push({
            id: bid.id,
            amount: bid.amount,
            created_at: bid.created_at,
          });
          // Sort bids by amount in descending order
          auction.bids.sort((a, b) => b.amount - a.amount);
        });
      }

      // Convert map to array and sort by end time
      const sortedAuctions = Array.from(auctionMap.values()).sort((a, b) => 
        new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
      );

      setAuctions(sortedAuctions);
      // Expand the first auction by default if there are any
      if (sortedAuctions.length > 0) {
        setExpandedAuctionId(sortedAuctions[0].auctionId);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a001f] flex items-center justify-center">
        <Card className="bg-black/40 border-[#DBD2A4]/20 p-8 text-center">
          <p className="text-gray-400">Bitte melden Sie sich an, um Ihre Auktionen zu sehen.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a001f]">
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1E4959]/30 via-[#0a001f]/60 to-[#DBD2A4]/20"
        style={{ mixBlendMode: "color-dodge" }}
      />

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
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
                {user.user_metadata?.full_name || user.email}
              </h1>
              <p className="text-[#DBD2A4]">
                Mitglied seit{" "}
                {new Date(user?.created_at).toLocaleDateString("de-CH")}
              </p>
            </div>
          </div>
        </div>

        {/* Auctions List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#DBD2A4] mb-6">Meine Auktionen</h2>
          
          {auctions.length === 0 ? (
            <Card className="bg-black/40 border-[#DBD2A4]/20 p-8 text-center">
              <p className="text-gray-400">Sie haben noch keine Gebote abgegeben.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {auctions.map((auction) => (
                <AuctionHistoryCard
                  key={auction.auctionId}
                  auction={auction}
                  isExpanded={expandedAuctionId === auction.auctionId}
                  onToggle={() => setExpandedAuctionId(
                    expandedAuctionId === auction.auctionId ? null : auction.auctionId
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleSignInComponent } from "./GoogleSignIn";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Auction {
  id: string;
  title: string;
  description: string;
  current_price: number;
  min_bid_increment: number;
  end_time: string;
  is_active: boolean;
  spot_duration: string;
  spot_placement: string;
  spot_details: string;
  example_video_url: string;
}

interface Bid {
  id: string;
  user_id: string;
  amount: number;
  created_at: string;
  user_email?: string;
}

// Custom hook for real-time auction updates
function useAuctionSubscription(onAuctionUpdate: (auction: Auction) => void) {
  useEffect(() => {
    // Create and subscribe to the channel
    const channel = supabase.channel('auction-channel', {
      config: {
        broadcast: { self: true }
      }
    });

    // Subscribe to auction updates
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auctions',
          filter: 'is_active=eq.true'
        },
        (payload) => {
          console.log('Auction change received:', payload);
          if (payload.new) {
            onAuctionUpdate(payload.new as Auction);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids'
        },
        (payload) => {
          console.log('New bid received:', payload);
          // Fetch latest auction data
          fetchLatestAuction();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Helper function to fetch latest auction data
    const fetchLatestAuction = async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('is_active', true)
        .single();

      if (!error && data) {
        onAuctionUpdate(data);
      }
    };

    // Cleanup subscription
    return () => {
      channel.unsubscribe();
    };
  }, [onAuctionUpdate]);
}

// Update the bid history component with Shadcn components
const AnimatedBidHistory = ({ bids, user }: { bids: Bid[], user: User | null }) => {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {bids.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`
                ${bid.user_id === user?.id ? 'bg-[#1E4959]' : 'bg-black/40'} 
                rounded-lg p-4 border border-[#DBD2A4]/20 shadow-md
                transform transition-all duration-200 hover:border-[#DBD2A4]/40
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-[#DBD2A4] font-medium">
                    {bid.user_id === user?.id ? 'Ihr Gebot' : 'Neues Gebot'}
                  </span>
                  {index === 0 && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 ml-2">
                      Höchstgebot
                    </Badge>
                  )}
                </div>
                <span className="text-xl font-bold text-white">
                  CHF {bid.amount.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {new Date(bid.created_at).toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};

export function Auctionpricecomponent() {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<{days: number; hours: number; minutes: number; seconds: number} | null>(null);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isHighestBidder, setIsHighestBidder] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingBidAmount, setPendingBidAmount] = useState<number | null>(null);

  // Callback for auction updates
  const handleAuctionUpdate = useCallback((newAuction: Auction) => {
    console.log('Updating auction state:', newAuction);
    setAuction(newAuction);
  }, []);

  // Use the custom hook
  useAuctionSubscription(handleAuctionUpdate);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        checkTermsAcceptance(user.id);
      }

      // Fetch auction details
      const { data, error } = await supabase
        .from("auctions")
        .select("*")
        .eq("is_active", true)
        .single();

      if (!error && data) {
        setAuction(data);
      }
    };

    fetchInitialData();
  }, []);

  const checkTermsAcceptance = async (userId: string) => {
    const { data, error } = await supabase
      .from("terms_acceptance")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setHasAcceptedTerms(true);
    }
  };

  const handleTermsAcceptance = async () => {
    if (!user) return;

    const { error } = await supabase.from("terms_acceptance").insert([
      {
        user_id: user.id,
        terms_version: 1,
      },
    ]);

    if (!error) {
      setHasAcceptedTerms(true);
    }
  };

  // Fix the bid history fetch query
  const fetchBidHistory = async () => {
    if (!auction?.id) return;
    
    const { data, error } = await supabase
      .from('bids')
      .select(`
        id,
        amount,
        created_at,
        user_id,
        auction_id
      `)
      .eq('auction_id', auction.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setBids(data);
      
      // Update highest bidder status
      if (user && data.length > 0) {
        setIsHighestBidder(data[0].user_id === user.id);
      }
    } else {
      console.error('Error fetching bid history:', error);
    }
  };

  // Add effect to fetch bid history periodically
  useEffect(() => {
    if (auction?.id) {
      fetchBidHistory();
      const interval = setInterval(fetchBidHistory, 5000);
      return () => clearInterval(interval);
    }
  }, [auction?.id, user?.id]);

  // Update TimeUnit component with better contrast
  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-[#1E4959] rounded-lg p-4 backdrop-blur-sm min-w-[80px] border border-[#DBD2A4]/20 shadow-lg">
        <span className="text-4xl font-bold text-white">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-sm mt-2 text-[#DBD2A4] font-medium">{label}</span>
    </div>
  );

  // Update useEffect for timer
  useEffect(() => {
    if (auction?.end_time) {
      const timer = setInterval(() => {
        const end = new Date(auction.end_time).getTime();
        const now = new Date().getTime();
        const distance = end - now;

        if (distance < 0) {
          setTimeLeft(null);
          clearInterval(timer);
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auction?.end_time]);

  // Update handleBid to show confirmation dialog
  const handleBid = () => {
    if (!user) {
      setError("Bitte melden Sie sich an, um ein Gebot abzugeben");
      return;
    }

    if (isHighestBidder) {
      setError("Sie sind bereits Höchstbietender");
      return;
    }

    if (!hasAcceptedTerms) {
      setError("Bitte akzeptieren Sie die Nutzungsbedingungen");
      return;
    }

    if (!bidAmount || isNaN(Number(bidAmount))) {
      setError("Bitte geben Sie einen gültigen Betrag ein");
      return;
    }

    const amount = Number(bidAmount);

    if (auction && amount <= auction.current_price) {
      setError(`Das Gebot muss höher sein als der aktuelle Preis (CHF ${auction.current_price.toLocaleString()})`);
      return;
    }

    if (auction && amount < (auction.current_price + auction.min_bid_increment)) {
      setError(`Minimale Erhöhung: CHF ${auction.min_bid_increment.toLocaleString()}`);
      return;
    }

    setPendingBidAmount(amount);
    setShowConfirmDialog(true);
  };

  // Add confirmBid function
  const confirmBid = async () => {
    if (!pendingBidAmount || !auction) return;
    
    setIsLoading(true);
    setError('');
    setShowConfirmDialog(false);

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) throw new Error('Benutzer nicht authentifiziert');

      const { data, error } = await supabase
        .rpc('place_bid', {
          p_auction_id: auction.id,
          p_user_id: currentUser.id,
          p_amount: pendingBidAmount
        });

      if (error) throw error;

      if (data && !data.success) {
        throw new Error(data.message);
      }

      setBidAmount('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setPendingBidAmount(null);
    }
  };

  return (
    <section
      style={{
        backgroundImage: "url('/assets/background_auction.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-16 space-y-16"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-12">
        {/* Timer Section */}
        {timeLeft && (
          <div className="flex justify-center gap-6">
            <TimeUnit value={timeLeft.days} label="Tage" />
            <TimeUnit value={timeLeft.hours} label="Stunden" />
            <TimeUnit value={timeLeft.minutes} label="Minuten" />
            <TimeUnit value={timeLeft.seconds} label="Sekunden" />
          </div>
        )}

        {/* Video and Product Details - Full Width */}
        <div className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60 backdrop-blur-lg border border-[#DBD2A4]/20 shadow-lg">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              src="/assets/ufo-video.mp4"
              poster="/assets/productPhotography_placeholder1.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {auction && (
            <Card className="bg-black/60 p-6 rounded-lg backdrop-blur-sm border-[#DBD2A4]/20">
              <h2 className="text-2xl font-bold mb-4 text-[#DBD2A4]">{auction.title}</h2>
              <p className="text-lg text-white/90">{auction.description}</p>
            </Card>
          )}
        </div>

        {/* Bidding Section - Two Columns */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Current Bid Card */}
          <Card className="bg-black/60 p-6 rounded-lg backdrop-blur-sm border-[#DBD2A4]/20 shadow-lg">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl text-[#DBD2A4] font-semibold mb-4">Aktuelles Gebot</h2>
                <motion.div
                  key={auction?.current_price}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold text-white mb-2"
                >
                  CHF {auction?.current_price?.toLocaleString() || "---"}
                </motion.div>
                <p className="text-sm text-[#DBD2A4]">
                  Minimale Erhöhung: CHF {auction?.min_bid_increment?.toLocaleString() || "---"}
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Fehler</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {user && auction ? (
                <div className="space-y-4">
                  {!hasAcceptedTerms ? (
                    <Card className="bg-black/40 p-4 space-y-4">
                      <h3 className="text-lg font-semibold text-[#DBD2A4]">Nutzungsbedingungen</h3>
                      <ScrollArea className="h-40 rounded-md border border-[#DBD2A4]/20 p-4">
                        <div className="text-sm text-white/90">
                          <p>1. Allgemeine Bestimmungen</p>
                          <p>Diese Nutzungsbedingungen regeln die Teilnahme an der Auktion für Werbeplätze...</p>
                        </div>
                      </ScrollArea>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={hasAcceptedTerms}
                          onCheckedChange={() => handleTermsAcceptance()}
                        />
                        <label htmlFor="terms" className="text-sm font-medium text-white/90">
                          Ich akzeptiere die Nutzungsbedingungen
                        </label>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="Geben Sie Ihr Gebot ein"
                          className="h-12 pl-12 text-lg bg-white/95 border-[#DBD2A4]/30 focus:border-[#DBD2A4]/60"
                          min={auction?.current_price + auction?.min_bid_increment}
                          step={auction?.min_bid_increment}
                          disabled={isHighestBidder}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                          CHF
                        </span>
                      </div>
                      <Button
                        onClick={handleBid}
                        disabled={isLoading || isHighestBidder}
                        variant={isHighestBidder ? "secondary" : "default"}
                        className={`w-full h-12 text-lg font-medium ${
                          isHighestBidder 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-[#1E4959] hover:bg-[#2a6275] text-white'
                        }`}
                      >
                        {isLoading
                          ? "Gebot wird platziert..."
                          : isHighestBidder
                          ? "Aktuell Höchstbietender"
                          : "Gebot abgeben"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-[#DBD2A4] font-medium">Bitte melden Sie sich an, um ein Gebot abzugeben</p>
                  <GoogleSignInComponent />
                </div>
              )}
            </div>
          </Card>

          {/* Live Bids */}
          <Card className="bg-black/60 p-6 rounded-lg backdrop-blur-sm border-[#DBD2A4]/20 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-[#DBD2A4] sticky top-0 bg-black/60 backdrop-blur-sm py-2">
              Live Gebote
            </h3>
            <AnimatedBidHistory bids={bids} user={user} />
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gebot bestätigen</DialogTitle>
            <DialogDescription>
              Möchten Sie das folgende Gebot verbindlich abgeben?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <span className="text-3xl font-bold">
              CHF {pendingBidAmount?.toLocaleString()}
            </span>
          </div>
          <Separator />
          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Abbrechen
            </Button>
            <Button
              onClick={confirmBid}
              className="bg-[#1E4959] hover:bg-[#2a6275] text-white"
            >
              Gebot bestätigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

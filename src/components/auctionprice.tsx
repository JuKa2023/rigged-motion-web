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
import { Textarea } from "@/components/ui/textarea";

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

interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  product_vision: string;
}

interface DimensionFormInputs {
  length: string;
  width: string;
  height: string;
  product_vision: string;
}

const DIMENSION_LIMITS = {
  length: { min: 1, max: 50 }, // cm
  width: { min: 1, max: 50 }, // cm
  height: { min: 1, max: 30 }, // cm
};

// Custom hook for real-time auction updates
function useAuctionSubscription(onAuctionUpdate: (auction: Auction) => void, onNewBid: (bid: Bid) => void) {
  useEffect(() => {
    // Create and subscribe to the channel
    const channel = supabase.channel("auction-channel", {
      config: {
        broadcast: { self: true },
      },
    });

    // Subscribe to auction updates
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auctions",
          filter: "is_active=eq.true",
        },
        (payload) => {
          console.log("Auction change received:", payload);
          if (payload.new) {
            onAuctionUpdate(payload.new as Auction);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
        },
        (payload) => {
          console.log("New bid received:", payload);
          if (payload.new) {
            onNewBid(payload.new as Bid);
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [onAuctionUpdate, onNewBid]);
}

// Update the bid history component with Shadcn components
const AnimatedBidHistory = ({
  bids,
  user,
}: {
  bids: Bid[];
  user: User | null;
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format date based on when it occurred
    let dateText;
    if (date.toDateString() === today.toDateString()) {
      dateText = "Heute";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateText = "Gestern";
    } else {
      dateText = date.toLocaleDateString("de-CH", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }

    // Get time
    const time = date.toLocaleTimeString("de-CH", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateText}, ${time}`;
  };

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
                ${bid.user_id === user?.id ? "bg-[#1E4959]" : "bg-black/40"} 
                rounded-lg p-4 border border-[#DBD2A4]/20 shadow-md
                transform transition-all duration-200 hover:border-[#DBD2A4]/40
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      index === 0 ? "bg-green-400 animate-pulse" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-[#DBD2A4] font-medium">
                    {bid.user_id === user?.id ? "Ihr Gebot" : "Neues Gebot"}
                  </span>
                  {index === 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-400 ml-2"
                    >
                      Höchstgebot
                    </Badge>
                  )}
                </div>
                <span className="text-xl font-bold text-white">
                  CHF {bid.amount.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {formatDateTime(bid.created_at)}
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
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isHighestBidder, setIsHighestBidder] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingBidAmount, setPendingBidAmount] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<ProductDimensions | null>(null);
  const [dimensionsError, setDimensionsError] = useState<string>("");
  const [formInputs, setFormInputs] = useState<DimensionFormInputs>({
    length: "",
    width: "",
    height: "",
    product_vision: ""
  });

  // Callback for auction updates
  const handleAuctionUpdate = useCallback((newAuction: Auction) => {
    console.log("Updating auction state:", newAuction);
    setAuction(newAuction);
  }, []);

  // Add callback for new bids
  const handleNewBid = useCallback((newBid: Bid) => {
    setBids(prevBids => {
      // Add new bid to the start of the array and keep only the last 5
      const updatedBids = [newBid, ...prevBids].slice(0, 5);
      
      // Update highest bidder status immediately if the user placed this bid
      if (user && newBid.user_id === user.id) {
        setIsHighestBidder(true);
      } else if (user && isHighestBidder) {
        // If user was highest bidder but someone else placed a bid, update status
        setIsHighestBidder(false);
      }
      
      return updatedBids;
    });
  }, [user, isHighestBidder]);

  // Use the custom hook with both callbacks
  useAuctionSubscription(handleAuctionUpdate, handleNewBid);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await checkTermsAcceptance(user.id);
      }

      // Fetch auction details
      const { data: auctionData, error: auctionError } = await supabase
        .from("auctions")
        .select("*")
        .eq("is_active", true)
        .single();

      if (!auctionError && auctionData) {
        setAuction(auctionData);

        // If we have both user and auction, check for existing preferences
        if (user) {
          const { data: preferencesData, error: preferencesError } = await supabase
            .from("user_auction_preferences")
            .select("*")
            .eq("user_id", user.id)
            .eq("auction_id", auctionData.id)
            .single();

          if (!preferencesError && preferencesData) {
            setDimensions({
              length: preferencesData.length,
              width: preferencesData.width,
              height: preferencesData.height,
              product_vision: preferencesData.product_vision
            });
          }
        }

        // Fetch initial bid history
        const { data: bidsData, error: bidsError } = await supabase
          .from("bids")
          .select(`
            id,
            amount,
            created_at,
            user_id,
            auction_id
          `)
          .eq("auction_id", auctionData.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (!bidsError && bidsData) {
          setBids(bidsData);
          // Set initial highest bidder status
          if (user && bidsData.length > 0) {
            setIsHighestBidder(bidsData[0].user_id === user.id);
          }
        }
      }
    };

    fetchInitialData();
  }, []);

  // Add function to check if dimensions are valid
  const validateInputs = (inputs: DimensionFormInputs): boolean => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);

    if (
      isNaN(length) ||
      length < DIMENSION_LIMITS.length.min ||
      length > DIMENSION_LIMITS.length.max
    ) {
      setDimensionsError(
        `Länge muss zwischen ${DIMENSION_LIMITS.length.min} und ${DIMENSION_LIMITS.length.max} cm liegen`
      );
      return false;
    }
    if (
      isNaN(width) ||
      width < DIMENSION_LIMITS.width.min ||
      width > DIMENSION_LIMITS.width.max
    ) {
      setDimensionsError(
        `Breite muss zwischen ${DIMENSION_LIMITS.width.min} und ${DIMENSION_LIMITS.width.max} cm liegen`
      );
      return false;
    }
    if (
      isNaN(height) ||
      height < DIMENSION_LIMITS.height.min ||
      height > DIMENSION_LIMITS.height.max
    ) {
      setDimensionsError(
        `Höhe muss zwischen ${DIMENSION_LIMITS.height.min} und ${DIMENSION_LIMITS.height.max} cm liegen`
      );
      return false;
    }
    if (!inputs.product_vision.trim()) {
      setDimensionsError("Bitte geben Sie eine Produktbeschreibung ein");
      return false;
    }
    return true;
  };

  // Modify checkTermsAcceptance to also check for preferences
  const checkTermsAcceptance = async (userId: string) => {
    const { data: termsData, error: termsError } = await supabase
      .from("terms_acceptance")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!termsError && termsData) {
      setHasAcceptedTerms(true);
    }

    if (auction) {
      const { data: preferencesData, error: preferencesError } = await supabase
        .from("user_auction_preferences")
        .select("*")
        .eq("user_id", userId)
        .eq("auction_id", auction.id)
        .single();

      if (!preferencesError && preferencesData) {
        setDimensions({
          length: preferencesData.length,
          width: preferencesData.width,
          height: preferencesData.height,
          product_vision: preferencesData.product_vision
        });
      }
    }
  };

  // Add function to handle dimension submission
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auction) return;

    if (!validateInputs(formInputs)) {
      return;
    }

    const newPreferences = {
      length: parseFloat(formInputs.length),
      width: parseFloat(formInputs.width),
      height: parseFloat(formInputs.height),
      product_vision: formInputs.product_vision.trim()
    };

    const { error } = await supabase.from("user_auction_preferences").insert([
      {
        user_id: user.id,
        auction_id: auction.id,
        ...newPreferences
      },
    ]);

    if (!error) {
      setDimensionsError("");
      setDimensions(newPreferences);
    } else {
      setDimensionsError(
        "Fehler beim Speichern der Präferenzen. Bitte versuchen Sie es erneut."
      );
    }
  };

  const handleInputChange =
    (field: keyof DimensionFormInputs) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormInputs((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setDimensionsError(""); // Clear any previous errors when user is typing
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

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-[#1E4959] rounded-lg p-4 backdrop-blur-sm min-w-[80px] border border-[#DBD2A4]/20 shadow-lg">
        <span className="text-4xl font-bold text-white">
          {value.toString().padStart(2, "0")}
        </span>
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
            hours: Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auction?.end_time]);

  // Update handleBid to check for preferences
  const handleBid = async () => {
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

    if (!dimensions) {
      setError("Bitte geben Sie zuerst Ihre Produktdetails ein");
      return;
    }

    if (!bidAmount || isNaN(Number(bidAmount))) {
      setError("Bitte geben Sie einen gültigen Betrag ein");
      return;
    }

    const amount = Number(bidAmount);

    if (auction && amount <= auction.current_price) {
      setError(
        `Das Gebot muss höher sein als der aktuelle Preis (CHF ${auction.current_price.toLocaleString()})`
      );
      return;
    }

    if (auction && amount < auction.current_price + auction.min_bid_increment) {
      setError(
        `Minimale Erhöhung: CHF ${auction.min_bid_increment.toLocaleString()}`
      );
      return;
    }

    setPendingBidAmount(amount);
    setShowConfirmDialog(true);
  };

  // Update confirmBid to handle the response better
  const confirmBid = async () => {
    if (!pendingBidAmount || !auction) return;

    setIsLoading(true);
    setError("");
    setShowConfirmDialog(false);

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) throw new Error("Benutzer nicht authentifiziert");

      const { data, error } = await supabase.rpc("place_bid", {
        p_auction_id: auction.id,
        p_user_id: currentUser.id,
        p_amount: pendingBidAmount,
      });

      if (error) throw error;

      if (data && !data.success) {
        throw new Error(data.message);
      }

      setBidAmount("");
      // The real-time subscription will handle updating the bid history
      // and highest bidder status
    } catch (err: any) {
      setError(err.message);
      setIsHighestBidder(false); // Reset highest bidder status if bid failed
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
      <div className="absolute inset-0 bg-black/60" />

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
              src="/assets/versteigerung/ufo_video.mp4"
              poster="/assets/productPhotography_placeholder1.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {auction && (
            <Card className="bg-black/60 p-6 rounded-lg backdrop-blur-sm border-[#DBD2A4]/20">
              <h2 className="text-2xl font-bold mb-4 text-[#DBD2A4]">
                {auction.title}
              </h2>
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
                <h2 className="text-xl text-[#DBD2A4] font-semibold mb-4">
                  Aktuelles Gebot
                </h2>
                <motion.div
                  key={auction?.current_price}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold text-white mb-2"
                >
                  CHF {auction?.current_price?.toLocaleString() || "---"}
                </motion.div>
                <p className="text-sm text-[#DBD2A4]">
                  Minimale Erhöhung: CHF{" "}
                  {auction?.min_bid_increment?.toLocaleString() || "---"}
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
                  {!dimensions ? (
                    <Card className="bg-black/40 p-4 space-y-4">
                      <h3 className="text-lg font-semibold text-[#DBD2A4]">
                        Produktdetails
                      </h3>
                      <p className="text-sm text-white/90">
                        Bevor Sie ein Gebot abgeben können, geben Sie bitte die
                        Abmessungen und eine Beschreibung Ihres Produkts ein.
                      </p>
                      <form
                        onSubmit={handlePreferencesSubmit}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm text-[#DBD2A4]">
                              Länge (cm)
                            </label>
                            <Input
                              type="number"
                              value={formInputs.length}
                              onChange={handleInputChange("length")}
                              min={DIMENSION_LIMITS.length.min}
                              max={DIMENSION_LIMITS.length.max}
                              step="0.1"
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-[#DBD2A4]">
                              Breite (cm)
                            </label>
                            <Input
                              type="number"
                              value={formInputs.width}
                              onChange={handleInputChange("width")}
                              min={DIMENSION_LIMITS.width.min}
                              max={DIMENSION_LIMITS.width.max}
                              step="0.1"
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-[#DBD2A4]">
                              Höhe (cm)
                            </label>
                            <Input
                              type="number"
                              value={formInputs.height}
                              onChange={handleInputChange("height")}
                              min={DIMENSION_LIMITS.height.min}
                              max={DIMENSION_LIMITS.height.max}
                              step="0.1"
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-[#DBD2A4]">
                            Produktbeschreibung
                          </label>
                          <Textarea
                            value={formInputs.product_vision}
                            onChange={handleInputChange("product_vision")}
                            placeholder="Beschreiben Sie Ihr Produkt und wie Sie es in der Animation präsentiert sehen möchten..."
                            required
                            className="mt-1 min-h-[100px] bg-white/95 border-[#DBD2A4]/30 focus:border-[#DBD2A4]/60"
                          />
                        </div>
                        {dimensionsError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {dimensionsError}
                            </AlertDescription>
                          </Alert>
                        )}
                        <Button
                          type="submit"
                          className="w-full bg-[#1E4959] hover:bg-[#2a6275] text-white"
                        >
                          Details bestätigen
                        </Button>
                      </form>
                    </Card>
                  ) : !hasAcceptedTerms ? (
                    <Card className="bg-black/40 p-4 space-y-4">
                      <h3 className="text-lg font-semibold text-[#DBD2A4]">
                        Nutzungsbedingungen
                      </h3>
                      <div className="rounded-md border border-[#DBD2A4]/20 p-4 mb-4">
                        <h4 className="text-md font-medium text-[#DBD2A4] mb-2">
                          Ihre Produktdetails
                        </h4>
                        <p className="text-sm text-white/90">
                          Länge: {dimensions.length} cm
                          <br />
                          Breite: {dimensions.width} cm
                          <br />
                          Höhe: {dimensions.height} cm
                        </p>
                        <div className="mt-4">
                          <h4 className="text-md font-medium text-[#DBD2A4] mb-2">
                            Ihre Vision
                          </h4>
                          <p className="text-sm text-white/90">
                            {dimensions.product_vision}
                          </p>
                        </div>
                      </div>
                      <ScrollArea className="h-40 rounded-md border border-[#DBD2A4]/20 p-4">
                        <div className="text-sm text-white/90">
                          <p>1. Allgemeine Bestimmungen</p>
                          <p>
                            Diese Nutzungsbedingungen regeln die Teilnahme an
                            der Auktion für Werbeplätze.
                          </p>
                          <p className="mt-4">
                            Bitte lesen Sie den vollständigen{" "}
                            <a
                              href="/assets/legal/auction_contract.pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#DBD2A4] hover:underline"
                            >
                              Auktionsvertrag (PDF)
                            </a>{" "}
                            sorgfältig durch, bevor Sie ein Gebot abgeben.
                          </p>
                          <p className="mt-4">
                            Mit der Teilnahme an der Auktion und der Abgabe
                            eines Gebots stimmen Sie den Bedingungen des
                            Auktionsvertrags zu.
                          </p>
                        </div>
                      </ScrollArea>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={hasAcceptedTerms}
                          onCheckedChange={() => handleTermsAcceptance()}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium text-white/90"
                        >
                          Ich akzeptiere die Nutzungsbedingungen und den
                          Auktionsvertrag
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
                          min={
                            auction?.current_price + auction?.min_bid_increment
                          }
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
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-[#1E4959] hover:bg-[#2a6275] text-white"
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
                  <p className="text-[#DBD2A4] font-medium">
                    Bitte melden Sie sich an, um ein Gebot abzugeben
                  </p>
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

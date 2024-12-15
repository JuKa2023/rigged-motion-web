import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleSignInComponent } from "./GoogleSignIn";

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

export function Auctionpricecomponent() {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        checkTermsAcceptance(user.id);
      }
    });

    // Fetch auction details
    fetchAuction();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("auction_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auctions",
        },
        (payload) => {
          setAuction(payload.new as Auction);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

  useEffect(() => {
    if (auction?.end_time) {
      const timer = setInterval(() => {
        const end = new Date(auction.end_time).getTime();
        const now = new Date().getTime();
        const distance = end - now;

        if (distance < 0) {
          setTimeLeft("Auction ended");
          clearInterval(timer);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auction?.end_time]);

  const fetchAuction = async () => {
    const { data, error } = await supabase
      .from("auctions")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching auction:", error);
      return;
    }

    setAuction(data);
  };

  const handleBid = async () => {
    if (!user) {
      setError("Please sign in to place a bid");
      return;
    }

    if (!hasAcceptedTerms) {
      setError("Please accept the terms of service before bidding");
      return;
    }

    if (!bidAmount || isNaN(Number(bidAmount))) {
      setError("Please enter a valid bid amount");
      return;
    }

    const amount = Number(bidAmount);

    if (auction && amount <= auction.current_price) {
      setError(
        `Bid must be higher than current price (${auction.current_price})`
      );
      return;
    }

    if (auction && amount < auction.current_price + auction.min_bid_increment) {
      setError(`Minimum bid increment is ${auction.min_bid_increment}`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: bidError } = await supabase.from("bids").insert([
        {
          auction_id: auction?.id,
          amount: amount,
          user_id: user.id,
        },
      ]);

      if (bidError) throw bidError;

      setBidAmount("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      style={{
        backgroundImage: "url('/assets/background_auction.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-16 space-y-16 text-center"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {auction && (
          <div className="bg-black/30 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">{auction.title}</h2>
            <p className="text-lg text-gray-200 mb-6">{auction.description}</p>
          </div>
        )}

        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-lg border border-blue-400/30">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src="/assets/ufo-video.mp4"
            poster="/assets/productPhotography_placeholder1.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Timer Section */}
        <div className="text-2xl font-bold">
          {timeLeft && (
            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              Verbleibende Zeit: {timeLeft}
            </div>
          )}
        </div>

        {/* Current Bid Section */}
        <div className="space-y-4">
          <h2 className="text-xl uppercase">Aktuelles Gebot</h2>
          <p className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            CHF {auction?.current_price?.toLocaleString() || "---"}
          </p>
          <p className="text-sm">
            Mindestgebot: CHF{" "}
            {auction?.min_bid_increment?.toLocaleString() || "---"}
          </p>
        </div>

        {/* Bidding Section */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md w-full">
              {error}
            </div>
          )}

          {user && auction ? (
            <div className="space-y-4 w-full">
              {!hasAcceptedTerms && (
                <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm space-y-4">
                  <h3 className="text-lg font-semibold">
                    Allgemeine Geschäftsbedingungen
                  </h3>
                  <div className="text-sm text-left max-h-40 overflow-y-auto bg-black/20 p-4 rounded">
                    <p>1. Allgemeines</p>
                    <p>
                      Diese AGB regeln die Teilnahme an der Auktion für
                      Werbeplätze...
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={hasAcceptedTerms}
                      onCheckedChange={() => handleTermsAcceptance()}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ich akzeptiere die AGB
                    </label>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 w-full">
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Geben Sie Ihr Gebot ein"
                  className="text-black"
                  min={auction?.current_price + auction?.min_bid_increment}
                  step={auction?.min_bid_increment}
                />
                <Button
                  onClick={handleBid}
                  disabled={isLoading || !hasAcceptedTerms}
                  className="whitespace-nowrap"
                >
                  {isLoading
                    ? "Gebot wird platziert..."
                    : hasAcceptedTerms
                    ? "Gebot abgeben"
                    : "AGB akzeptieren"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 w-full text-center flex flex-col items-center">
              <p className="text-yellow-400">
                Bitte melden Sie sich an, um ein Gebot abzugeben
              </p>
              <GoogleSignInComponent />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

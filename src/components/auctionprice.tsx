import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { User } from "@supabase/supabase-js"

interface Auction {
  id: string
  title: string
  description: string
  current_price: number
  min_bid_increment: number
  end_time: string
  status: 'active' | 'completed' | 'cancelled'
}

interface Bid {
  id: string
  auction_id: string
  user_id: string
  amount: number
  created_at: string
}

export function Auctionpricecomponent() {
    const [auction, setAuction] = useState<Auction | null>(null)
    const [bidAmount, setBidAmount] = useState<string>('')
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Get current user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        // Fetch auction details
        fetchAuction()

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('auction_updates')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'auctions',
                },
                (payload) => {
                    setAuction(payload.new as Auction)
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (auction?.end_time) {
            const timer = setInterval(() => {
                const end = new Date(auction.end_time).getTime()
                const now = new Date().getTime()
                const distance = end - now

                if (distance < 0) {
                    setTimeLeft('Auction ended')
                    clearInterval(timer)
                } else {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000)
                    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
                }
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [auction?.end_time])

    const fetchAuction = async () => {
        const { data, error } = await supabase
            .from('auctions')
            .select('*')
            .eq('status', 'active')
            .single()

        if (error) {
            console.error('Error fetching auction:', error)
            return
        }

        setAuction(data)
    }

    const handleBid = async () => {
        if (!user) {
            setError('Please sign in to place a bid')
            return
        }

        if (!bidAmount || isNaN(Number(bidAmount))) {
            setError('Please enter a valid bid amount')
            return
        }

        const amount = Number(bidAmount)

        if (auction && amount <= auction.current_price) {
            setError(`Bid must be higher than current price (${auction.current_price})`)
            return
        }

        if (auction && amount < (auction.current_price + auction.min_bid_increment)) {
            setError(`Minimum bid increment is ${auction.min_bid_increment}`)
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const { error: bidError } = await supabase
                .from('bids')
                .insert([
                    {
                        auction_id: auction?.id,
                        amount: amount,
                        user_id: user.id
                    }
                ])

            if (bidError) throw bidError

            setBidAmount('')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section
            style={{
                backgroundImage: "url('/assets/background_auction.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-16 space-y-16 text-center"
        >
            {/* Header Section */}
            <div className="space-y-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-4">{auction?.title || 'Loading...'}</h1>
                <p className="text-lg md:text-xl lg:text-2xl">
                    {auction?.description || 'Es könnte ihr Produkt sein, welches hier auf der Erde landet. Bieten Sie jetzt mit, um Ihr Produkt galaktisch zu bewerben'}
                </p>
            </div>

            {/* Timer Section */}
            <div className="text-2xl font-bold">
                {timeLeft && (
                    <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                        Time Remaining: {timeLeft}
                    </div>
                )}
            </div>

            {/* Current Bid Section */}
            <div className="space-y-4">
                <h2 className="text-xl uppercase">Aktuelles Gebot</h2>
                <p className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                    CHF {auction?.current_price?.toLocaleString() || '---'}
                </p>
                <p className="text-sm">
                    Minimum increment: CHF {auction?.min_bid_increment?.toLocaleString() || '---'}
                </p>
            </div>

            {/* Bidding Section */}
            <div className="flex flex-col items-center space-y-4 w-full max-w-md">
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-md w-full">
                        {error}
                    </div>
                )}
                
                {user ? (
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <Input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="Enter bid amount"
                            className="text-black"
                            min={auction?.current_price + auction?.min_bid_increment}
                            step={auction?.min_bid_increment}
                        />
                        <Button 
                            onClick={handleBid}
                            disabled={isLoading}
                            className="whitespace-nowrap"
                        >
                            {isLoading ? 'Placing Bid...' : 'Place Bid'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 w-full">
                        <p className="text-yellow-400">
                            Please sign in to place a bid
                        </p>
                        <Button variant="secondary" className="w-full">
                            Sign in to Bid
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}
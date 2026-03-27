import HeroSection from '@/components/modules/home/HeroSection'
import RecentReviewsSection from '@/components/modules/home/RecentReviewsSection'
import TopRatedRestaurantsSection from '@/components/modules/home/TopRatedRestaurantsSection'
import TrendingDishesSection from '@/components/modules/home/TrendingDishesSection'
import React from 'react'

export default function HomePage() {
  return (
    <div>
       <HeroSection />
       <TrendingDishesSection />
       <RecentReviewsSection />
       <TopRatedRestaurantsSection />
    </div>
  )
}

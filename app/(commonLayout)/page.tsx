import HeroSection from '@/components/modules/home/HeroSection'
import SecondHeroSection from '@/components/modules/home/SecondHeroSection'
import RecentReviewsSection from '@/components/modules/home/RecentReviewsSection'
import TopRatedRestaurantsSection from '@/components/modules/home/TopRatedRestaurantsSection'
import TrendingDishesSection from '@/components/modules/home/TrendingDishesSection'
import HowItWorksSection from '@/components/modules/home/HowItWorksSection'
import CtaSection from '@/components/modules/home/CtaSection'
import React from 'react'
import ScrollAnimationWrapper from '@/components/modules/home/ScrollAnimationWrapper'

export default function HomePage() {
  return (
    <div>
      <ScrollAnimationWrapper>
        <HeroSection />
      </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
        <SecondHeroSection />
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <TrendingDishesSection />
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <RecentReviewsSection />
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <TopRatedRestaurantsSection />
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <HowItWorksSection />
      </ScrollAnimationWrapper>

    

      <ScrollAnimationWrapper>
        <CtaSection />
      </ScrollAnimationWrapper>
    </div>
  )
}

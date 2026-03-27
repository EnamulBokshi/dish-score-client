"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loading,
  SkeletonCard,
  EmptyRestaurants,
  ErrorConnectionFailed,
} from "@/components/common";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  const [currentState, setCurrentState] = useState<
    "hero" | "loading" | "skeleton" | "empty" | "error" | "success"
  >("hero");
  
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      {/* Hero Section */}
      {currentState === "hero" && (
        <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
          <div className="max-w-3xl text-center space-y-6 fade-in">
            <h2 className="text-5xl md:text-7xl font-bold">
              <span className="text-neon-orange">Discover</span> Amazing Food &{" "}
              <span className="text-neon-gold">Trusted</span> Reviews
            </h2>
            <p className="text-lg text-[#a0a0a0] max-w-2xl mx-auto">
              Rate restaurants and dishes. Share your food experiences with a
              community of food enthusiasts. Find your next favorite place to eat.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="btn-neon-primary" size="lg">
                Get Started
              </Button>
              <Button className="btn-outline-neon" size="lg">
                Explore Restaurants
              </Button>
            </div>

            {/* Component Preview Buttons */}
            <div className="pt-12 border-t border-dark-border mt-12">
              <p className="text-sm text-[#a0a0a0] mb-4">
                Component Preview (Development)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentState("loading")}
                  className="text-xs"
                >
                  Loading
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentState("skeleton")}
                  className="text-xs"
                >
                  Skeleton
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentState("empty")}
                  className="text-xs"
                >
                  Empty
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentState("error")}
                  className="text-xs"
                >
                  Error
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentState("hero")}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* State Components Preview */}
      {currentState !== "hero" && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <Button
            variant="ghost"
            onClick={() => setCurrentState("hero")}
            className="mb-6 text-[#a0a0a0] hover:text-foreground"
          >
            ← Back to Hero
          </Button>

          {currentState === "loading" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Loading State
              </h2>
              <Loading message="Fetching restaurants..." size="md" />
            </div>
          )}

          {currentState === "skeleton" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Skeleton Loading
              </h2>
              <SkeletonCard count={3} variant="grid" />
            </div>
          )}

          {currentState === "empty" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Empty State
              </h2>
              <EmptyRestaurants
                onCreateNew={() => alert("Create new restaurant")}
              />
            </div>
          )}

          {currentState === "error" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Error State
              </h2>
              <ErrorConnectionFailed onRetry={() => setCurrentState("hero")} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

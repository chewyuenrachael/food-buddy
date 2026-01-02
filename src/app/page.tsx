'use client';

import Link from 'next/link';
import { MapPin, Share2, Route, Utensils, ArrowRight, Star } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { Header } from '@/components/layout';
import { ListCard } from '@/components/lists';
import { mockLists } from '@/lib/mock-data';

export default function HomePage() {
  const featuredLists = mockLists.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/20 text-white">
              🇸🇬 Singapore Food Guide
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The Local&apos;s Guide to Singapore Food
            </h1>
            <p className="mt-6 text-lg text-orange-100">
              Skip the tourist traps. Discover where locals actually eat with
              curated lists from food influencers and passionate Singaporeans.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50"
                asChild
              >
                <Link href="/lists">
                  Explore Food Lists
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/lists/new">Create Your List</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative food icons */}
        <div className="absolute right-8 top-8 hidden text-6xl opacity-20 lg:block">
          🍜 🥢 🍛
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why Food Buddy?
            </h2>
            <p className="mt-2 text-gray-600">
              We&apos;re not another review site. We&apos;re your local friend.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Utensils className="h-6 w-6" />}
              title="Curated by Locals"
              description="Lists created by Singaporeans and food influencers who actually know where to eat."
            />
            <FeatureCard
              icon={<Route className="h-6 w-6" />}
              title="Optimized Food Routes"
              description="Get walking directions through multiple stops with estimated times."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6" />}
              title="Easy Sharing"
              description="Share your food list with visiting family via QR code. No app download needed."
            />
            <FeatureCard
              icon={<Star className="h-6 w-6" />}
              title="Cultural Context"
              description="Learn what makes each dish special with tourist-friendly explanations."
            />
          </div>
        </div>
      </section>

      {/* Featured Lists Section */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Lists
              </h2>
              <p className="mt-1 text-gray-600">
                Hand-picked guides from our community
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/lists">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Got family visiting Singapore?
            </h2>
            <p className="mt-4 text-gray-600">
              Create a personalized food list and share it via QR code. They can
              view your recommendations instantly—no app download required.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/lists/new">
                  <Share2 className="h-5 w-5" />
                  Create a List to Share
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Food Buddy</span>
            </div>
            <p className="text-sm text-gray-500">
              Made with ❤️ for Singapore food lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

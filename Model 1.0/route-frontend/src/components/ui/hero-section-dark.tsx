import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaOnClick: () => void; // Changed from ctaHref
  bottomImage: {
    light: string;
    dark: string;
  };
  gridOptions?: string; // Placeholder for grid styling
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ title, subtitle, description, ctaText, ctaOnClick, bottomImage, gridOptions, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-background py-24 sm:py-32 lg:py-40",
          className
        )}
        {...props}
      >
        <div className="relative mx-auto max-w-screen-xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {subtitle}
            </p>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              {description}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={ctaOnClick}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {ctaText} <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        {/* Placeholder for bottom image and grid */}
        <div className="mt-16 flow-root sm:mt-24">
          <div className="relative -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <img
              src={bottomImage.light} // Use light image by default
              alt="App screenshot"
              width={2432}
              height={1442}
              className="rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:hidden"
            />
            <img
              src={bottomImage.dark} // Use dark image for dark mode
              alt="App screenshot"
              width={2432}
              height={1442}
              className="hidden rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:block"
            />
          </div>
        </div>
        {/* Grid overlay - assuming this is handled by CSS variables and Tailwind */}
        <div className={cn("absolute inset-0 -z-10", gridOptions)}></div>
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
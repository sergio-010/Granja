import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Skeleton */}
            <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4 py-3 lg:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 lg:gap-3">
                        <Skeleton className="h-8 w-8 lg:h-10 lg:w-10 rounded-full" />
                        <Skeleton className="h-6 w-40 lg:h-8 lg:w-48" />
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4">
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section Skeleton */}
                <section className="py-12 lg:py-24 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="container mx-auto px-4 text-center">
                        <Skeleton className="h-6 w-64 mx-auto mb-4" />
                        <Skeleton className="h-16 w-96 mx-auto mb-4" />
                        <Skeleton className="h-8 w-80 mx-auto mb-3" />
                        <Skeleton className="h-20 w-full max-w-3xl mx-auto mb-8" />
                        <div className="flex gap-3 lg:gap-4 justify-center">
                            <Skeleton className="h-11 w-48" />
                            <Skeleton className="h-11 w-36" />
                        </div>
                    </div>
                </section>

                {/* Content Skeleton */}
                <section className="py-12 lg:py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8 lg:mb-12">
                            <Skeleton className="h-10 w-64 mx-auto mb-2" />
                            <Skeleton className="h-6 w-48 mx-auto" />
                        </div>
                        <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="border rounded-lg overflow-hidden">
                                    <Skeleton className="w-full h-56" />
                                    <div className="p-6 space-y-3">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-10 w-full mt-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

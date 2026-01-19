'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error('Page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                        <CardTitle>Error en la página</CardTitle>
                    </div>
                    <CardDescription>
                        Ocurrió un error al cargar esta página.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === 'development' && (
                        <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm font-mono break-all">{error.message}</p>
                            {error.digest && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    ID: {error.digest}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={reset} className="flex-1">
                            Reintentar
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
                            Ir al inicio
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

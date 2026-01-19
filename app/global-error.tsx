'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <html lang="es">
            <body>
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <Card className="max-w-lg w-full border-destructive">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                                <CardTitle>Error Crítico</CardTitle>
                            </div>
                            <CardDescription>
                                La aplicación encontró un error crítico y necesita reiniciarse.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === 'development' && (
                                <div className="p-4 bg-destructive/10 rounded-md">
                                    <p className="text-sm font-mono text-destructive break-all">
                                        {error.message}
                                    </p>
                                    {error.digest && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Digest: {error.digest}
                                        </p>
                                    )}
                                </div>
                            )}
                            <Button onClick={reset} className="w-full">
                                Intentar de nuevo
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </body>
        </html>
    );
}

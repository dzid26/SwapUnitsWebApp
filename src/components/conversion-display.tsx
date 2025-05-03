import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { ConversionResult } from '@/types';
import { cn } from '@/lib/utils';

interface ConversionDisplayProps {
    fromValue: number | undefined | null;
    fromUnit: string;
    result: ConversionResult | null;
}

export function ConversionDisplay({ fromValue, fromUnit, result }: ConversionDisplayProps) {
    if (!result || fromValue === undefined || fromValue === null) {
        return null; // Don't display anything if there's no result or input value
    }

    // Format numbers for better readability
    const formatNumber = (num: number): string => {
        // Use exponential notation for very large or very small numbers
        if (Math.abs(num) > 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(4);
        }
        // Otherwise, format with commas and appropriate decimal places
        return num.toLocaleString(undefined, { maximumFractionDigits: 6 });
    };

    return (
        <Card className="bg-secondary/10 border-secondary shadow-sm">
            <CardContent className="p-4">
                <div className="text-center sm:text-left">
                    <p className="text-sm text-muted-foreground">
                        {formatNumber(fromValue)} {fromUnit} equals
                    </p>
                    <p className="text-2xl font-bold text-secondary-foreground">
                        {formatNumber(result.value)}{' '}
                        <span className="text-lg font-medium">{result.unit}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

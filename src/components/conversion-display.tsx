
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { ConversionResult } from '@/types';
import { cn } from '@/lib/utils';

interface ConversionDisplayProps {
    fromValue: number | undefined; // Can be undefined during typing or if invalid
    fromUnit: string;
    result: ConversionResult | null;
}

export function ConversionDisplay({ fromValue, fromUnit, result }: ConversionDisplayProps) {
    // Display only if we have a valid result AND a valid input value was used to calculate it
    if (!result || fromValue === undefined || fromUnit === '') {
         // Optionally, render a placeholder or nothing when calculation isn't possible/ready
        return (
            <Card className="bg-muted/50 border-muted shadow-sm opacity-60">
                <CardContent className="p-4">
                    <div className="text-center sm:text-left">
                        <p className="text-sm text-muted-foreground h-5">
                            {/* Placeholder text or empty */}
                             {fromValue !== undefined && fromUnit ? `${formatNumber(fromValue)} ${fromUnit} equals...` : 'Enter a value to convert'}
                        </p>
                        <p className="text-2xl font-bold text-muted-foreground h-[32px]">
                           {/* Placeholder */}
                           -
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-secondary/10 border-secondary shadow-sm transition-opacity duration-200">
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


// Format numbers for better readability (moved outside component for reuse if needed)
const formatNumber = (num: number): string => {
    // Use exponential notation for very large or very small numbers
    if (Math.abs(num) > 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(4);
    }
    // Otherwise, format with commas and appropriate decimal places
    // Handle potential NaN/Infinity before formatting
    if (!isFinite(num)) {
        return '-'; // Or some other indicator for invalid numbers
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 });
};
    
    
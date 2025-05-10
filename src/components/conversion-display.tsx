
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { ConversionResult, NumberFormat, UnitCategory } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversionDisplayProps {
    fromValue: number | undefined;
    fromUnit: string;
    result: ConversionResult | null;
    format: NumberFormat;
    onActualFormatChange: (
        actualFormat: NumberFormat,
        reason: 'magnitude' | 'user_choice' | null
    ) => void;
    category: UnitCategory | ""; // Added category prop
    onResultCopied?: (data: { // Callback for when result is copied
        category: UnitCategory;
        fromValue: number;
        fromUnit: string;
        toValue: number;
        toUnit: string;
    }) => void;
}

const formatNumber = (num: number, requestedFormat: NumberFormat = 'normal'): {
    formattedString: string;
    actualFormatUsed: NumberFormat;
    scientificReason: 'magnitude' | 'user_choice' | null;
} => {
    if (!isFinite(num)) {
        return { formattedString: '-', actualFormatUsed: requestedFormat, scientificReason: null };
    }

    let actualFormatUsed: NumberFormat = requestedFormat;
    let formattedString: string;
    let scientificReason: 'magnitude' | 'user_choice' | null = null;

    const useScientificDueToMagnitude = (Math.abs(num) > 1e9 || Math.abs(num) < 1e-7) && num !== 0;

    if (requestedFormat === 'scientific' || useScientificDueToMagnitude) {
        actualFormatUsed = 'scientific';
        scientificReason = useScientificDueToMagnitude ? 'magnitude' : (requestedFormat === 'scientific' ? 'user_choice' : null);
        
        let exponential = num.toExponential(7).replace('e', 'E');
        const match = exponential.match(/^(-?\d(?:\.\d*)?)(0*)(E[+-]\d+)$/);
        if (match) {
            let coefficient = match[1];
            const exponent = match[3];
            if (coefficient.includes('.')) {
                coefficient = coefficient.replace(/0+$/, '');
                coefficient = coefficient.replace(/\.$/, '');
            }
            formattedString = coefficient + exponent;
        } else {
            formattedString = exponential;
        }
    } else {
        actualFormatUsed = 'normal';
        const numRoundedForCheck = parseFloat(num.toFixed(7));
        if (numRoundedForCheck % 1 === 0) {
            formattedString = numRoundedForCheck.toLocaleString(undefined, { maximumFractionDigits: 0 });
        } else {
            // Ensure we show up to 7 decimal places but remove trailing zeros if less are needed.
            // toLocaleString with maximumFractionDigits: 7 might add trailing zeros.
            // A more robust way is to use toFixed and then manually format.
            let fixedStr = num.toFixed(7);
            // Remove trailing zeros from the fractional part
            fixedStr = fixedStr.replace(/(\.[0-9]*[1-9])0+$|\.0+$/, '$1');
            // Potentially re-parse and use toLocaleString for grouping if needed, or just use fixedStr
            formattedString = parseFloat(fixedStr).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 7});
        }
    }

    return { formattedString, actualFormatUsed, scientificReason };
};

const formatFromValue = (num: number | undefined): string => {
    if (num === undefined || !isFinite(num)) {
        return '-';
    }
    const useScientificDueToMagnitude = (Math.abs(num) > 1e9 || Math.abs(num) < 1e-7) && num !== 0;

    if (useScientificDueToMagnitude) {
        let exponential = num.toExponential(7).replace('e', 'E');
        const match = exponential.match(/^(-?\d(?:\.\d*)?)(0*)(E[+-]\d+)$/);
        if (match) {
            let coefficient = match[1];
            const exponent = match[3];
            if (coefficient.includes('.')) {
                coefficient = coefficient.replace(/0+$/, '');
                coefficient = coefficient.replace(/\.$/, '');
            }
            return coefficient + exponent;
        }
        return exponential;
    }
    const numRoundedForCheck = parseFloat(num.toFixed(7));
     if (numRoundedForCheck % 1 === 0) {
        return numRoundedForCheck.toLocaleString(undefined, { maximumFractionDigits: 0 });
    } else {
        let fixedStr = num.toFixed(7);
        fixedStr = fixedStr.replace(/(\.[0-9]*[1-9])0+$|\.0+$/, '$1');
        return parseFloat(fixedStr).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 7});
    }
};

export const ConversionDisplay = React.memo(function ConversionDisplayComponent({ 
    fromValue, 
    fromUnit, 
    result, 
    format, 
    onActualFormatChange,
    category, // Destructure category
    onResultCopied // Destructure onResultCopied
}: ConversionDisplayProps) {
    const { toast } = useToast();

    const showPlaceholder = fromValue === undefined || fromUnit === '' || !result;

    const { formattedString: formattedResultString, actualFormatUsed, scientificReason } = React.useMemo(() => {
        return showPlaceholder ? { formattedString: '-', actualFormatUsed: format, scientificReason: null } : formatNumber(result.value, format);
    }, [showPlaceholder, result, format]);

    React.useEffect(() => {
        onActualFormatChange(actualFormatUsed, scientificReason);
    }, [actualFormatUsed, scientificReason, onActualFormatChange]);

    const textToCopy = showPlaceholder ? '' : `${formattedResultString} ${result.unit}`;

    const handleCopy = React.useCallback(async () => {
        if (!textToCopy || !navigator.clipboard) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            toast({
                title: "Copied!",
                description: `Result "${textToCopy}" copied to clipboard.`,
                variant: "confirmation",
                duration: 1500,
            });
            // Call onResultCopied if provided and category is valid
            if (onResultCopied && category && fromValue !== undefined && result) {
                onResultCopied({
                    category: category,
                    fromValue: fromValue,
                    fromUnit: fromUnit,
                    toValue: result.value,
                    toUnit: result.unit,
                });
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            toast({
                title: "Copy Failed",
                description: "Could not copy result to clipboard.",
                variant: "destructive",
            });
        }
    }, [textToCopy, toast, onResultCopied, category, fromValue, fromUnit, result]);

    const screenReaderText = showPlaceholder
        ? (fromValue !== undefined && fromUnit ? `Waiting for conversion of ${formatFromValue(fromValue)} ${fromUnit}` : 'Enter a value and select units to convert')
        : `${formatFromValue(fromValue!)} ${fromUnit} equals ${formattedResultString} ${result.unit}`;

    return (
        <>
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {screenReaderText}
            </div>
            <Card className={cn(
                "shadow-sm transition-opacity duration-300",
                showPlaceholder ? "bg-muted/50 border-muted opacity-60" : "bg-primary/10 border-primary/50"
            )}>
                <CardContent className="p-4">
                    <div className="text-center sm:text-left">
                        <p className="text-sm text-muted-foreground h-5">
                            {showPlaceholder
                             ? (fromValue !== undefined && fromUnit ? `${formatFromValue(fromValue)} ${fromUnit} equals...` : 'Enter a value to convert')
                             : `${formatFromValue(fromValue!)} ${fromUnit} equals`
                            }
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                             <p className={cn(
                                "text-2xl font-bold h-[32px] flex items-center",
                                showPlaceholder ? "text-muted-foreground" : "text-purple-600 dark:text-purple-400"
                             )}>
                               {showPlaceholder ? '-' : (
                                    <>
                                        {formattedResultString}{' '}
                                        <span className="text-lg font-medium text-purple-600 dark:text-purple-400 ml-1">{result.unit}</span>
                                    </>
                               )}
                            </p>
                            {!showPlaceholder && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                    onClick={handleCopy}
                                    aria-label="Copy result to clipboard"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
});

ConversionDisplay.displayName = 'ConversionDisplay';

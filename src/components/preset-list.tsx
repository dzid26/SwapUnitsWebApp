
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Update import: Remove presets and unitData, import only the sorting/filtering function
import { getFilteredAndSortedPresets } from "@/lib/unit-data";
import { type Preset, type UnitCategory } from '@/types'; // Import UnitCategory type
import { List } from 'lucide-react';
import { UnitIcon } from './unit-icon'; // Import the UnitIcon component
import { cn } from "@/lib/utils"; // Import cn

interface PresetListProps {
    onPresetSelect: (preset: Preset) => void;
}

// Memoize the component to prevent unnecessary re-renders
export const PresetList = React.memo(function PresetListComponent({ onPresetSelect }: PresetListProps) {
    // Get the filtered and sorted list of presets using the updated logic
    const displayPresets = React.useMemo(() => getFilteredAndSortedPresets(), []);

    return (
        // Add aria-label for better context
        // Add hidden md:block to hide on mobile and show on medium screens and up
        <Card className={cn("shadow-lg hidden md:block")} aria-label="Common Unit Conversion Presets">
            <CardHeader>
                {/* Use H2 for secondary headings on the page */}
                <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                    <List className="h-5 w-5" aria-hidden="true" />
                    Common Conversions {/* Changed text */}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Removed ScrollArea and fixed height */}
                {/* Use a list for semantic structure */}
                <ul className="space-y-2">
                    {/* Map over the filtered and sorted presets */}
                    {displayPresets.map((preset, index) => (
                        <li key={`${preset.category}-${preset.name}-${index}`}> {/* More unique key */}
                          <Button
                              variant="ghost"
                              // Added overflow-hidden and whitespace-normal, flex, items-center, gap-2
                              className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-primary hover:text-primary-foreground overflow-hidden whitespace-normal flex items-center gap-2"
                              onClick={() => onPresetSelect(preset)}
                              aria-label={`Select preset: ${preset.name}`} // More descriptive label
                          >
                              {/* Add UnitIcon before the preset name */}
                              <UnitIcon category={preset.category} className="h-4 w-4 shrink-0" aria-hidden="true" />
                              <span className="flex-1">{preset.name}</span> {/* Wrap name in span for flex control */}
                          </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
});

PresetList.displayName = 'PresetList';


import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { presets } from "@/lib/unit-data";
import { type Preset, type UnitCategory } from '@/types'; // Import UnitCategory type
import { List } from 'lucide-react';
import { UnitIcon } from './unit-icon'; // Import the UnitIcon component

interface PresetListProps {
    onPresetSelect: (preset: Preset) => void;
}

// Memoize the component to prevent unnecessary re-renders
export const PresetList = React.memo(function PresetListComponent({ onPresetSelect }: PresetListProps) {
    return (
        // Add aria-label for better context
        <Card className="shadow-lg" aria-label="Common Unit Conversion Presets">
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
                    {/* Limit the displayed presets to the first 15 */}
                    {presets.slice(0, 15).map((preset, index) => (
                        <li key={index}> {/* Wrap button in li */}
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

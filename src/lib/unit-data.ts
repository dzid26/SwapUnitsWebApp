

import type { UnitCategory, UnitData, Preset, Unit, ConverterMode } from '@/types';

// Base units:
// Length: Meter (m)
// Mass: Kilogram (kg)
// Temperature: Celsius (°C) - Special handling
// Time: Second (s)
// Pressure: Pascal (Pa)
// Area: Square Meter (m²)
// Volume: Cubic Meter (m³)
// Energy: Joule (J)
// Speed: Meter per second (m/s)
// Fuel Economy: Kilometer per Liter (km/L) - Note: Higher is better
// Data Storage: Byte (B)
// Data Transfer Rate: Bits per second (bps)
// Bitcoin: Bitcoin (BTC)
// Ethereum: Wei (wei)

export const unitData: Record<UnitCategory, UnitData> = {
  Length: {
    name: 'Length',
    units: [
      { name: 'Meter', symbol: 'm', factor: 1, mode: 'all' },
      { name: 'Kilometer', symbol: 'km', factor: 1000, mode: 'all' },
      { name: 'Centimeter', symbol: 'cm', factor: 0.01, mode: 'all' },
      { name: 'Millimeter', symbol: 'mm', factor: 0.001, mode: 'all' },
      { name: 'Mile', symbol: 'mi', factor: 1609.34, mode: 'all' },
      { name: 'Yard', symbol: 'yd', factor: 0.9144, mode: 'advanced' },
      { name: 'Foot', symbol: 'ft', factor: 0.3048, mode: 'all' },
      { name: 'Inch', symbol: 'in', factor: 0.0254, mode: 'all' },
    ],
  },
  Mass: {
    name: 'Mass',
    units: [
      { name: 'Kilogram', symbol: 'kg', factor: 1, mode: 'all' },
      { name: 'Gram', symbol: 'g', factor: 0.001, mode: 'all' },
      { name: 'Milligram', symbol: 'mg', factor: 0.000001, mode: 'all' },
      { name: 'Metric Ton', symbol: 't', factor: 1000, mode: 'advanced' },
      { name: 'Pound', symbol: 'lb', factor: 0.453592, mode: 'all' },
      { name: 'Ounce', symbol: 'oz', factor: 0.0283495, mode: 'all' },
    ],
  },
  Temperature: {
    name: 'Temperature',
    units: [
      // Factors are handled specially for temperature
      { name: 'Celsius', symbol: '°C', factor: 1, mode: 'all' },
      { name: 'Fahrenheit', symbol: '°F', factor: 1, mode: 'all' },
      { name: 'Kelvin', symbol: 'K', factor: 1, mode: 'all' },
    ],
  },
  Time: {
    name: 'Time',
    units: [
      { name: 'Second', symbol: 's', factor: 1, mode: 'all' },
      { name: 'Millisecond', symbol: 'ms', factor: 0.001, mode: 'all' },
      { name: 'Microsecond', symbol: 'µs', factor: 1e-6, mode: 'advanced' },
      { name: 'Nanosecond', symbol: 'ns', factor: 1e-9, mode: 'advanced' },
      { name: 'Picosecond', symbol: 'ps', factor: 1e-12, mode: 'advanced' },
      { name: 'Femtosecond', symbol: 'fs', factor: 1e-15, mode: 'advanced' },
      { name: 'Minute', symbol: 'min', factor: 60, mode: 'all' },
      { name: 'Hour', symbol: 'hr', factor: 3600, mode: 'all' },
      { name: 'Day', symbol: 'day', factor: 86400, mode: 'all' },
    ],
  },
   Pressure: {
    name: 'Pressure',
    units: [
      { name: 'Pascal', symbol: 'Pa', factor: 1, mode: 'all' },
      { name: 'Kilopascal', symbol: 'kPa', factor: 1000, mode: 'all' },
      { name: 'Bar', symbol: 'bar', factor: 100000, mode: 'all' },
      { name: 'Atmosphere', symbol: 'atm', factor: 101325, mode: 'advanced' },
      { name: 'Pound per square inch', symbol: 'psi', factor: 6894.76, mode: 'all' },
    ],
  },
  Area: {
    name: 'Area',
    units: [
        { name: 'Square Meter', symbol: 'm²', factor: 1, mode: 'all' },
        { name: 'Square Kilometer', symbol: 'km²', factor: 1000000, mode: 'advanced' },
        { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001, mode: 'all' },
        { name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001, mode: 'advanced' },
        { name: 'Square Mile', symbol: 'mi²', factor: 2589988.11, mode: 'advanced' },
        { name: 'Square Yard', symbol: 'yd²', factor: 0.836127, mode: 'advanced' },
        { name: 'Square Foot', symbol: 'ft²', factor: 0.092903, mode: 'all' },
        { name: 'Square Inch', symbol: 'in²', factor: 0.00064516, mode: 'advanced' },
        { name: 'Hectare', symbol: 'ha', factor: 10000, mode: 'all' },
        { name: 'Acre', symbol: 'acre', factor: 4046.86, mode: 'all' },
    ],
   },
    Volume: {
        name: 'Volume',
        units: [
            { name: 'Cubic Meter', symbol: 'm³', factor: 1, mode: 'all' },
            { name: 'Cubic Kilometer', symbol: 'km³', factor: 1e9, mode: 'advanced' },
            { name: 'Cubic Centimeter', symbol: 'cm³', factor: 1e-6, mode: 'all' },
            { name: 'Cubic Millimeter', symbol: 'mm³', factor: 1e-9, mode: 'advanced' },
            { name: 'Liter', symbol: 'L', factor: 0.001, mode: 'all' },
            { name: 'Milliliter', symbol: 'mL', factor: 1e-6, mode: 'all' },
            { name: 'Gallon (US)', symbol: 'gal', factor: 0.00378541, mode: 'all' },
            { name: 'Quart (US)', symbol: 'qt', factor: 0.000946353, mode: 'advanced' },
            { name: 'Pint (US)', symbol: 'pt', factor: 0.000473176, mode: 'advanced' },
            { name: 'Cup (US)', symbol: 'cup', factor: 0.000236588, mode: 'advanced' },
            { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 2.95735e-5, mode: 'advanced' },
            { name: 'Tablespoon (US)', symbol: 'tbsp', factor: 1.47868e-5, mode: 'advanced' },
            { name: 'Teaspoon (US)', symbol: 'tsp', factor: 4.92892e-6, mode: 'advanced' },
            { name: 'Cubic Foot', symbol: 'ft³', factor: 0.0283168, mode: 'all' },
            { name: 'Cubic Inch', symbol: 'in³', factor: 1.63871e-5, mode: 'advanced' },
        ],
    },
    Energy: {
        name: 'Energy',
        units: [
            { name: 'Joule', symbol: 'J', factor: 1, mode: 'all' },
            { name: 'Kilojoule', symbol: 'kJ', factor: 1000, mode: 'all' },
            { name: 'Calorie', symbol: 'cal', factor: 4.184, mode: 'all' },
            { name: 'Kilocalorie (food)', symbol: 'kcal', factor: 4184, mode: 'all' },
            { name: 'Watt Hour', symbol: 'Wh', factor: 3600, mode: 'advanced' },
            { name: 'Kilowatt Hour', symbol: 'kWh', factor: 3.6e6, mode: 'all' },
            { name: 'Electronvolt', symbol: 'eV', factor: 1.60218e-19, mode: 'advanced' },
            { name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.06, mode: 'all' },
            { name: 'Foot-pound', symbol: 'ft⋅lb', factor: 1.35582, mode: 'advanced' },
        ],
    },
    Speed: {
        name: 'Speed',
        units: [
            { name: 'Meter per second', symbol: 'm/s', factor: 1, mode: 'all' },
            { name: 'Kilometer per hour', symbol: 'km/h', factor: 1 / 3.6, mode: 'all' },
            { name: 'Mile per hour', symbol: 'mph', factor: 0.44704, mode: 'all' },
            { name: 'Foot per second', symbol: 'ft/s', factor: 0.3048, mode: 'advanced' },
            { name: 'Knot', symbol: 'kn', factor: 0.514444, mode: 'advanced' }, // Nautical mile per hour
        ],
    },
    'Fuel Economy': {
        name: 'Fuel Economy',
        units: [
            { name: 'Kilometer per Liter', symbol: 'km/L', factor: 1, mode: 'all' },
            { name: 'Liter per 100 kilometers', symbol: 'L/100km', factor: 100, mode: 'all' }, // Higher value is worse, special handling might be needed
            { name: 'Mile per Gallon (US)', symbol: 'MPG (US)', factor: 0.425144, mode: 'all' },
            { name: 'Mile per Gallon (UK)', symbol: 'MPG (UK)', factor: 0.354006, mode: 'all' },
        ],
    },
    'Data Storage': {
        name: 'Data Storage',
        units: [
            { name: 'Bit', symbol: 'bit', factor: 1 / 8, mode: 'advanced' },
            { name: 'Byte', symbol: 'B', factor: 1, mode: 'all' },
            { name: 'Kilobyte', symbol: 'KB', factor: 1024, mode: 'all' },
            { name: 'Megabyte', symbol: 'MB', factor: 1024 ** 2, mode: 'all' },
            { name: 'Gigabyte', symbol: 'GB', factor: 1024 ** 3, mode: 'all' },
            { name: 'Terabyte', symbol: 'TB', factor: 1024 ** 4, mode: 'all' },
            { name: 'Petabyte', symbol: 'PB', factor: 1024 ** 5, mode: 'advanced' },
        ],
    },
    'Data Transfer Rate': {
        name: 'Data Transfer Rate',
        units: [
            { name: 'Bits per second', symbol: 'bps', factor: 1, mode: 'all' },
            { name: 'Kilobits per second', symbol: 'Kbps', factor: 1000, mode: 'all' },
            { name: 'Megabits per second', symbol: 'Mbps', factor: 1e6, mode: 'all' },
            { name: 'Gigabits per second', symbol: 'Gbps', factor: 1e9, mode: 'all' },
            { name: 'Terabits per second', symbol: 'Tbps', factor: 1e12, mode: 'advanced' },
            { name: 'Bytes per second', symbol: 'B/s', factor: 8, mode: 'all' },
            { name: 'Kilobytes per second', symbol: 'KB/s', factor: 8 * 1000, mode: 'all' },
            { name: 'Megabytes per second', symbol: 'MB/s', factor: 8 * 1e6, mode: 'all' },
            { name: 'Gigabytes per second', symbol: 'GB/s', factor: 8 * 1e9, mode: 'advanced' },
            { name: 'Terabytes per second', symbol: 'TB/s', factor: 8 * 1e12, mode: 'advanced' },
        ],
    },
    Bitcoin: {
        name: 'Bitcoin',
        units: [
            { name: 'Bitcoin', symbol: 'BTC', factor: 1, mode: 'all' },
            { name: 'Satoshi', symbol: 'sat', factor: 1e-8, mode: 'all' },
        ],
    },
    Ethereum: { // Ethereum category will only be available in advanced mode
        name: 'Ethereum',
        units: [ // All Ethereum units are advanced
            { name: 'Ether', symbol: 'ETH', factor: 1e18, mode: 'advanced' }, // Base unit is Wei
            { name: 'Gwei', symbol: 'gwei', factor: 1e9, mode: 'advanced' },
            { name: 'Wei', symbol: 'wei', factor: 1, mode: 'advanced' },
        ],
    }
};

export const allPresets: Preset[] = [
  { category: 'Length', fromUnit: 'm', toUnit: 'ft', name: 'Meter to Feet' },
  { category: 'Length', fromUnit: 'km', toUnit: 'mi', name: 'Kilometer to Miles' },
  { category: 'Length', fromUnit: 'in', toUnit: 'cm', name: 'Inches to Centimeters' },
  { category: 'Mass', fromUnit: 'kg', toUnit: 'lb', name: 'Kilograms to Pounds' },
  { category: 'Mass', fromUnit: 'lb', toUnit: 'kg', name: 'Pounds to Kilograms' },
  { category: 'Mass', fromUnit: 'g', toUnit: 'oz', name: 'Grams to Ounces' },
  { category: 'Temperature', fromUnit: '°C', toUnit: '°F', name: 'Celsius to Fahrenheit' },
  { category: 'Temperature', fromUnit: '°F', toUnit: '°C', name: 'Fahrenheit to Celsius' },
  { category: 'Time', fromUnit: 'hr', toUnit: 'min', name: 'Hours to Minutes' },
  { category: 'Time', fromUnit: 's', toUnit: 'ms', name: 'Seconds to Milliseconds' },
  { category: 'Pressure', fromUnit: 'psi', toUnit: 'kPa', name: 'PSI to Kilopascals' },
  { category: 'Pressure', fromUnit: 'bar', toUnit: 'psi', name: 'Bar to PSI' },
  { category: 'Area', fromUnit: 'm²', toUnit: 'ft²', name: 'Square Meters to Square Feet' },
  { category: 'Area', fromUnit: 'acre', toUnit: 'm²', name: 'Acres to Square Meters' },
  { category: 'Volume', fromUnit: 'L', toUnit: 'gal', name: 'Liters to Gallons (US)' },
  { category: 'Volume', fromUnit: 'mL', toUnit: 'L', name: 'Milliliters to Liters' },
  { category: 'Energy', fromUnit: 'kWh', toUnit: 'BTU', name: 'Kilowatt Hours to BTU' },
  { category: 'Energy', fromUnit: 'J', toUnit: 'cal', name: 'Joules to Calories' },
  { category: 'Speed', fromUnit: 'km/h', toUnit: 'mph', name: 'km/h to mph' },
  { category: 'Speed', fromUnit: 'm/s', toUnit: 'km/h', name: 'm/s to km/h' },
  { category: 'Fuel Economy', fromUnit: 'MPG (US)', toUnit: 'km/L', name: 'MPG (US) to km/L' },
  { category: 'Fuel Economy', fromUnit: 'L/100km', toUnit: 'MPG (US)', name: 'L/100km to MPG (US)' },
  { category: 'Fuel Economy', fromUnit: 'km/L', toUnit: 'MPG (UK)', name: 'km/L to MPG (UK)' },
  { category: 'Data Storage', fromUnit: 'GB', toUnit: 'MB', name: 'Gigabytes to Megabytes' },
  { category: 'Data Storage', fromUnit: 'TB', toUnit: 'GB', name: 'Terabytes to Gigabytes' },
  { category: 'Data Transfer Rate', fromUnit: 'Mbps', toUnit: 'MB/s', name: 'Mbps to MB/s' },
  { category: 'Data Transfer Rate', fromUnit: 'Gbps', toUnit: 'Mbps', name: 'Gbps to Mbps' },
  { category: 'Bitcoin', fromUnit: 'BTC', toUnit: 'sat', name: 'Bitcoin to Satoshi' },
  { category: 'Bitcoin', fromUnit: 'sat', toUnit: 'BTC', name: 'Satoshi to Bitcoin' },
  { category: 'Ethereum', fromUnit: 'ETH', toUnit: 'gwei', name: 'ETH to Gwei' },
  { category: 'Ethereum', fromUnit: 'gwei', toUnit: 'wei', name: 'Gwei to Wei' },
];

const categoryOrder: UnitCategory[] = [
  'Length', 'Mass', 'Temperature', 'Time', 'Bitcoin', // Ethereum will only show in advanced mode anyway
  'Pressure', 'Area', 'Volume', 'Energy', 'Speed',
  'Fuel Economy', 'Data Storage', 'Data Transfer Rate', 'Ethereum' // Add Ethereum to the end for consistent ordering when available
];

export const getUnitsForCategoryAndMode = (category: UnitCategory | "", mode: ConverterMode): Unit[] => {
  const categoryKey = category as UnitCategory; // Type assertion
  if (!category || !unitData[categoryKey]) {
    return [];
  }
  const allCategoryUnits = unitData[categoryKey].units ?? [];

  if (mode === 'basic') {
    return allCategoryUnits.filter(unit => unit.mode !== 'advanced');
  }
  return allCategoryUnits; // Advanced mode gets all units (basic, advanced, all)
};

export const getFilteredAndSortedPresets = (): Preset[] => {
    // Sort all presets based on categoryOrder first
    const sortedByOrder = [...allPresets].sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.category);
        const indexB = categoryOrder.indexOf(b.category);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const finalPresets: Preset[] = [];
    const categoryCounts: Record<string, number> = {};

    // Pass 1: Ensure at least one preset per *ordered* category (up to the limit of 15)
    categoryOrder.forEach(catName => {
        if (finalPresets.length >= 15) return;

        // For Ethereum, only consider its presets if we assume it could be shown (even if filtered later by UI mode)
        // The filtering here is about which *presets* to list, not which *categories* are active in the UI.
        // This function provides the full list of potential presets to display.
        const presetForCategory = sortedByOrder.find(p => p.category === catName);
        if (presetForCategory) {
             const isAlreadyAdded = finalPresets.some(fp =>
                fp.name === presetForCategory.name && fp.category === presetForCategory.category
            );
            if (!isAlreadyAdded) {
                finalPresets.push(presetForCategory);
                categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
            }
        }
    });

    // Pass 2: Fill remaining slots up to 15, with max 2 per category, respecting original sort order
    sortedByOrder.forEach(preset => {
        if (finalPresets.length >= 15) return;

        const currentCount = categoryCounts[preset.category] || 0;
        const isAlreadyAdded = finalPresets.some(fp =>
           fp.name === preset.name && fp.category === preset.category
        );

        if (!isAlreadyAdded && currentCount < 2) {
            finalPresets.push(preset);
            categoryCounts[preset.category] = currentCount + 1;
        }
    });
    
    // Ensure the "km/L to MPG (UK)" preset is included if possible
    const lastRequestedPresetName = 'km/L to MPG (UK)';
    const lastRequestedPresetCategory: UnitCategory = 'Fuel Economy';
    const hasLastRequested = finalPresets.some(p => p.name === lastRequestedPresetName && p.category === lastRequestedPresetCategory);

    if (!hasLastRequested) {
        const presetToAdd = allPresets.find(p => p.name === lastRequestedPresetName && p.category === lastRequestedPresetCategory);
        if (presetToAdd) {
            if (finalPresets.length < 15) {
                finalPresets.push(presetToAdd);
                 // Re-sort based on categoryOrder after adding
                finalPresets.sort((a, b) => {
                    const indexA = categoryOrder.indexOf(a.category);
                    const indexB = categoryOrder.indexOf(b.category);
                    if (indexA === -1 && indexB === -1) return 0;
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;
                    return indexA - indexB;
                });
            } else {
                // Attempt to replace a less critical preset
                // Try to find a category with 2 presets that is not Bitcoin or Ethereum to replace its second instance
                let replaced = false;
                for (let i = finalPresets.length - 1; i >= 0; i--) {
                    const cat = finalPresets[i].category;
                    if (categoryCounts[cat] > 1 && cat !== 'Bitcoin' && cat !== 'Ethereum') {
                        // Find the first occurrence of this category
                        const firstIndexOfCat = finalPresets.findIndex(fp => fp.category === cat);
                        if (i !== firstIndexOfCat) { // if it's not the first one for this category
                            finalPresets[i] = presetToAdd;
                            replaced = true;
                             finalPresets.sort((a, b) => { /* re-sort */
                                const indexA = categoryOrder.indexOf(a.category);
                                const indexB = categoryOrder.indexOf(b.category);
                                return indexA - indexB;
                            });
                            break;
                        }
                    }
                }
                // If not replaced, and the last item is not Bitcoin/Ethereum, replace it
                if (!replaced && finalPresets.length > 0 && 
                    finalPresets[finalPresets.length - 1].category !== 'Bitcoin' && 
                    finalPresets[finalPresets.length - 1].category !== 'Ethereum') {
                     finalPresets[finalPresets.length - 1] = presetToAdd;
                     finalPresets.sort((a, b) => { /* re-sort */
                        const indexA = categoryOrder.indexOf(a.category);
                        const indexB = categoryOrder.indexOf(b.category);
                        return indexA - indexB;
                    });
                }
            }
        }
    }
    return finalPresets.slice(0, 15);
};

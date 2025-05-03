import type { UnitCategory, UnitData, Preset } from '@/types';

export const unitData: Record<UnitCategory, UnitData> = {
  Length: {
    name: 'Length',
    units: [
      { name: 'Meter', symbol: 'm', factor: 1 },
      { name: 'Kilometer', symbol: 'km', factor: 1000 },
      { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { name: 'Mile', symbol: 'mi', factor: 1609.34 },
      { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { name: 'Inch', symbol: 'in', factor: 0.0254 },
    ],
  },
  Mass: {
    name: 'Mass',
    units: [
      { name: 'Kilogram', symbol: 'kg', factor: 1 },
      { name: 'Gram', symbol: 'g', factor: 0.001 },
      { name: 'Milligram', symbol: 'mg', factor: 0.000001 },
      { name: 'Metric Ton', symbol: 't', factor: 1000 },
      { name: 'Pound', symbol: 'lb', factor: 0.453592 },
      { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
    ],
  },
  Temperature: {
    name: 'Temperature',
    units: [
      // Factors are handled specially for temperature
      { name: 'Celsius', symbol: '°C', factor: 1 },
      { name: 'Fahrenheit', symbol: '°F', factor: 1 },
      { name: 'Kelvin', symbol: 'K', factor: 1 },
    ],
  },
  Time: {
    name: 'Time',
    units: [
      { name: 'Second', symbol: 's', factor: 1 },
      { name: 'Millisecond', symbol: 'ms', factor: 0.001 },
      { name: 'Minute', symbol: 'min', factor: 60 },
      { name: 'Hour', symbol: 'hr', factor: 3600 },
      { name: 'Day', symbol: 'day', factor: 86400 },
    ],
  },
   Pressure: {
    name: 'Pressure',
    units: [
      { name: 'Pascal', symbol: 'Pa', factor: 1 },
      { name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
      { name: 'Bar', symbol: 'bar', factor: 100000 },
      { name: 'Atmosphere', symbol: 'atm', factor: 101325 },
      { name: 'Pound per square inch', symbol: 'psi', factor: 6894.76 },
    ],
  },
  Area: {
    name: 'Area',
    units: [
        { name: 'Square Meter', symbol: 'm²', factor: 1 },
        { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
        { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
        { name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001 },
        { name: 'Square Mile', symbol: 'mi²', factor: 2589988.11 },
        { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
        { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
        { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
        { name: 'Hectare', symbol: 'ha', factor: 10000 },
        { name: 'Acre', symbol: 'acre', factor: 4046.86 },
    ],
   },
    Volume: {
        name: 'Volume',
        units: [
            { name: 'Cubic Meter', symbol: 'm³', factor: 1 },
            { name: 'Cubic Kilometer', symbol: 'km³', factor: 1e9 },
            { name: 'Cubic Centimeter', symbol: 'cm³', factor: 1e-6 },
            { name: 'Cubic Millimeter', symbol: 'mm³', factor: 1e-9 },
            { name: 'Liter', symbol: 'L', factor: 0.001 },
            { name: 'Milliliter', symbol: 'mL', factor: 1e-6 },
            { name: 'Gallon (US)', symbol: 'gal', factor: 0.00378541 },
            { name: 'Quart (US)', symbol: 'qt', factor: 0.000946353 },
            { name: 'Pint (US)', symbol: 'pt', factor: 0.000473176 },
            { name: 'Cup (US)', symbol: 'cup', factor: 0.000236588 },
            { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 2.95735e-5 },
            { name: 'Tablespoon (US)', symbol: 'tbsp', factor: 1.47868e-5 },
            { name: 'Teaspoon (US)', symbol: 'tsp', factor: 4.92892e-6 },
            { name: 'Cubic Foot', symbol: 'ft³', factor: 0.0283168 },
            { name: 'Cubic Inch', symbol: 'in³', factor: 1.63871e-5 },
        ],
    },
    Energy: {
        name: 'Energy',
        units: [
            { name: 'Joule', symbol: 'J', factor: 1 },
            { name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
            { name: 'Calorie', symbol: 'cal', factor: 4.184 },
            { name: 'Kilocalorie (food)', symbol: 'kcal', factor: 4184 },
            { name: 'Watt Hour', symbol: 'Wh', factor: 3600 },
            { name: 'Kilowatt Hour', symbol: 'kWh', factor: 3.6e6 },
            { name: 'Electronvolt', symbol: 'eV', factor: 1.60218e-19 },
            { name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.06 },
            { name: 'Foot-pound', symbol: 'ft⋅lb', factor: 1.35582 },
        ],
    },
};

export const presets: Preset[] = [
  { category: 'Length', fromUnit: 'm', toUnit: 'ft', name: 'Meter to Feet' },
  { category: 'Length', fromUnit: 'km', toUnit: 'mi', name: 'Kilometer to Miles' },
  { category: 'Length', fromUnit: 'in', toUnit: 'cm', name: 'Inches to Centimeters' },
  { category: 'Mass', fromUnit: 'kg', toUnit: 'lb', name: 'Kilograms to Pounds' },
  { category: 'Mass', fromUnit: 'lb', toUnit: 'kg', name: 'Pounds to Kilograms' },
  { category: 'Mass', fromUnit: 'g', toUnit: 'oz', name: 'Grams to Ounces' },
  { category: 'Temperature', fromUnit: '°C', toUnit: '°F', name: 'Celsius to Fahrenheit' },
  { category: 'Temperature', fromUnit: '°F', toUnit: '°C', name: 'Fahrenheit to Celsius' },
  { category: 'Time', fromUnit: 'hr', toUnit: 'min', name: 'Hours to Minutes' },
  { category: 'Pressure', fromUnit: 'psi', toUnit: 'kPa', name: 'PSI to Kilopascals' },
  { category: 'Pressure', fromUnit: 'bar', toUnit: 'psi', name: 'Bar to PSI' },
  { category: 'Area', fromUnit: 'm²', toUnit: 'ft²', name: 'Square Meters to Square Feet' },
  { category: 'Volume', fromUnit: 'L', toUnit: 'gal', name: 'Liters to Gallons (US)' },
  { category: 'Energy', fromUnit: 'kWh', toUnit: 'BTU', name: 'Kilowatt Hours to BTU' },
];

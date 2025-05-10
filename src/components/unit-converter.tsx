

"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { unitData, getUnitsForCategoryAndMode } from "@/lib/unit-data"; // Added getUnitsForCategoryAndMode
import type { UnitCategory, Unit, ConversionResult, Preset, NumberFormat, ConverterMode } from "@/types"; // Added ConverterMode
import {
  ArrowRightLeft,
  FlaskConical,
} from "lucide-react";

import { UnitIcon } from "./unit-icon";
import { ConversionDisplay } from "./conversion-display";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label"; // For mode toggle
import { Switch } from "@/components/ui/switch"; // For mode toggle
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useImperativeHandle, forwardRef } from 'react';
import { Button } from "@/components/ui/button";


const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  fromUnit: z.string().min(1, "Please select an input unit"),
  toUnit: z.string().min(1, "Please select an output unit"),
  value: z.union([
     z.literal(''),
     z.coerce.number({ invalid_type_error: "Please enter a valid number" })
        .or(z.nan())
   ]).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface UnitConverterProps {
  className?: string;
  converterMode: ConverterMode;
  setConverterMode: (mode: ConverterMode) => void;
}

export interface UnitConverterHandle {
  handlePresetSelect: (preset: Preset) => void;
}


export const UnitConverter = React.memo(forwardRef<UnitConverterHandle, UnitConverterProps>(function UnitConverterComponent({ className, converterMode, setConverterMode, ...props }, ref) {
  const [selectedCategoryLocal, setSelectedCategoryLocal] = React.useState<UnitCategory | "">(""); // Tracks the category after successful setup
  const [conversionResult, setConversionResult] = React.useState<ConversionResult | null>(null);
  const [lastValidInputValue, setLastValidInputValue] = React.useState<number | undefined>(1);
  const [numberFormat, setNumberFormat] = React.useState<NumberFormat>('normal');
  const [isNormalFormatDisabled, setIsNormalFormatDisabled] = React.useState<boolean>(false);
  const isMobile = useIsMobile();
  const [prevConverterModeLocal, setPrevConverterModeLocal] = React.useState<ConverterMode>(converterMode);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      category: "Mass",
      fromUnit: "kg",
      toUnit: "g",
      value: 1,
    },
  });

  const { watch, setValue, reset, getValues, formState } = form;
  const rhfCategory = watch("category") as UnitCategory; // Category from react-hook-form
  const rhfFromUnit = watch("fromUnit");
  const rhfToUnit = watch("toUnit");
  const rhfValue = watch("value");

  const categoriesForDropdown = React.useMemo(() => {
    return (Object.keys(unitData) as UnitCategory[]).filter(category => {
        const units = getUnitsForCategoryAndMode(category, converterMode);
        return units.length > 0;
    });
  }, [converterMode]);


  const convertUnits = React.useCallback((data: Partial<FormData>): ConversionResult | null => {
    const { category, fromUnit, toUnit, value } = data;
    const numericValue = Number(value);

    if (!category || !fromUnit || !toUnit || value === undefined || value === null || !isFinite(numericValue) || value === '') {
        return null;
    }

    const currentUnits = getUnitsForCategoryAndMode(category as UnitCategory, converterMode); // Use mode here
    const fromUnitData = currentUnits.find((u) => u.symbol === fromUnit);
    const toUnitData = currentUnits.find((u) => u.symbol === toUnit);

    if (!fromUnitData || !toUnitData) {
      return null;
    }

    if (category === "Temperature") {
      let tempInCelsius: number;
      if (fromUnitData.symbol === "°C") {
        tempInCelsius = numericValue;
      } else if (fromUnitData.symbol === "°F") {
        tempInCelsius = (numericValue - 32) * (5 / 9);
      } else { // Kelvin
        tempInCelsius = numericValue - 273.15;
      }

      let resultValue: number;
      if (toUnitData.symbol === "°C") {
        resultValue = tempInCelsius;
      } else if (toUnitData.symbol === "°F") {
        resultValue = tempInCelsius * (9 / 5) + 32;
      } else { // Kelvin
        resultValue = tempInCelsius + 273.15;
      }
      return isFinite(resultValue) ? { value: resultValue, unit: toUnitData.symbol } : null;
    }

    if (category === "Fuel Economy") {
        let valueInKmPerL: number;
        if (fromUnitData.symbol === 'L/100km') {
            if (numericValue === 0) return null; 
            valueInKmPerL = fromUnitData.factor / numericValue; 
        } else {
            valueInKmPerL = numericValue * fromUnitData.factor;
        }

        let resultValue: number;
        if (toUnitData.symbol === 'L/100km') {
            if (valueInKmPerL === 0) return null; 
            resultValue = toUnitData.factor / valueInKmPerL; 
        } else {
            resultValue = valueInKmPerL / toUnitData.factor;
        }
        return isFinite(resultValue) ? { value: resultValue, unit: toUnitData.symbol } : null;
    }
    
    const valueInBaseUnit = numericValue * fromUnitData.factor;
    const resultValue = valueInBaseUnit / toUnitData.factor;
    return isFinite(resultValue) ? { value: resultValue, unit: toUnitData.symbol } : null;
  }, [converterMode]);


 React.useEffect(() => {
    const modeChanged = prevConverterModeLocal !== converterMode;
    let categoryToProcess = rhfCategory;

    if (modeChanged) {
        const isRhfCategoryValidInNewMode = getUnitsForCategoryAndMode(rhfCategory, converterMode).length > 0;
        if (!isRhfCategoryValidInNewMode) {
            // Category from RHF (e.g., Ethereum) is NOT valid in the new mode (e.g., basic)
            // Reset to the first valid category for the new mode.
            categoryToProcess = categoriesForDropdown[0] || 'Mass';
            setValue("category", categoryToProcess, { shouldValidate: true, shouldDirty: true });
            // Update local state trackers immediately for the rest of this effect run
            setSelectedCategoryLocal(categoryToProcess);
            setPrevConverterModeLocal(converterMode);
            // This will cause rhfCategory to update in the next render cycle,
            // but for this cycle, use categoryToProcess.
        }
    }

    const categoryChangedSystemOrUser = categoryToProcess !== selectedCategoryLocal || modeChanged;

    if (categoryChangedSystemOrUser && categoryToProcess) {
        const availableUnits = getUnitsForCategoryAndMode(categoryToProcess, converterMode);
        
        let newFromUnitSymbol = rhfFromUnit;
        let newToUnitSymbol = rhfToUnit;
        let resetValue = false;

        // Determine if units need to be reset to defaults
        const fromUnitStillValid = availableUnits.some(u => u.symbol === newFromUnitSymbol);
        const toUnitStillValid = availableUnits.some(u => u.symbol === newToUnitSymbol);

        if (categoryToProcess !== selectedCategoryLocal || modeChanged || !fromUnitStillValid || !toUnitStillValid) {
            resetValue = true; // Always reset value if category/mode changed or units became invalid
            switch (categoryToProcess) {
                case 'Length': newFromUnitSymbol = 'm'; newToUnitSymbol = 'ft'; break;
                case 'Mass': newFromUnitSymbol = 'kg'; newToUnitSymbol = 'g'; break;
                case 'Temperature': newFromUnitSymbol = '°C'; newToUnitSymbol = '°F'; break;
                case 'Time':
                    newFromUnitSymbol = 's';
                    newToUnitSymbol = converterMode === 'advanced' && availableUnits.some(u => u.symbol === 'fs') ? 'fs' : 'ms';
                    break;
                case 'Pressure': newFromUnitSymbol = 'Pa'; newToUnitSymbol = 'kPa'; break;
                case 'Area': newFromUnitSymbol = 'm²'; newToUnitSymbol = 'ft²'; break;
                case 'Volume': newFromUnitSymbol = 'L'; newToUnitSymbol = 'mL'; break;
                case 'Energy': newFromUnitSymbol = 'J'; newToUnitSymbol = 'kJ'; break;
                case 'Speed': newFromUnitSymbol = 'm/s'; newToUnitSymbol = 'km/h'; break;
                case 'Fuel Economy': newFromUnitSymbol = 'km/L'; newToUnitSymbol = 'MPG (US)'; break;
                case 'Data Storage': newFromUnitSymbol = 'GB'; newToUnitSymbol = 'MB'; break;
                case 'Data Transfer Rate': newFromUnitSymbol = 'Mbps'; newToUnitSymbol = 'MB/s'; break;
                case 'Bitcoin': newFromUnitSymbol = 'BTC'; newToUnitSymbol = 'sat'; break;
                case 'Ethereum': newFromUnitSymbol = 'ETH'; newToUnitSymbol = 'gwei'; break;
                default:
                    newFromUnitSymbol = availableUnits[0]?.symbol || "";
                    newToUnitSymbol = availableUnits.find(u => u.symbol !== newFromUnitSymbol)?.symbol || newFromUnitSymbol;
            }

            if (!availableUnits.some(u => u.symbol === newFromUnitSymbol)) {
                newFromUnitSymbol = availableUnits[0]?.symbol || "";
            }
            if (!availableUnits.some(u => u.symbol === newToUnitSymbol) || newFromUnitSymbol === newToUnitSymbol) {
                newToUnitSymbol = availableUnits.find(u => u.symbol !== newFromUnitSymbol)?.symbol || (availableUnits[0]?.symbol || "");
                 if (newFromUnitSymbol === newToUnitSymbol && availableUnits.length > 1) {
                    newToUnitSymbol = availableUnits[1]?.symbol || "";
                } else if (newFromUnitSymbol === newToUnitSymbol && availableUnits.length === 1) {
                    newToUnitSymbol = newFromUnitSymbol;
                }
            }
            setValue("fromUnit", newFromUnitSymbol, { shouldValidate: true, shouldDirty: true });
            setValue("toUnit", newToUnitSymbol, { shouldValidate: true, shouldDirty: true });
        }
        
        if (resetValue) {
            setValue("value", 1, { shouldValidate: true, shouldDirty: true });
            setLastValidInputValue(1);
            setNumberFormat('normal');
            setIsNormalFormatDisabled(false);
        }
        
        setSelectedCategoryLocal(categoryToProcess);
        if(modeChanged) setPrevConverterModeLocal(converterMode);

        // Trigger conversion with potentially updated units/value
        // Use a microtask to ensure RHF state is settled from setValue calls
        Promise.resolve().then(() => {
            const currentVals = getValues();
            const valToConvert = (typeof currentVals.value === 'string' && (isNaN(parseFloat(currentVals.value)) || currentVals.value.trim() === '')) || currentVals.value === undefined ? 1 : Number(currentVals.value);
            const result = convertUnits({ ...currentVals, value: valToConvert });
            setConversionResult(result);
        });
    }
 }, [rhfCategory, converterMode, setValue, getValues, convertUnits, selectedCategoryLocal, rhfFromUnit, rhfToUnit, prevConverterModeLocal, categoriesForDropdown]);


  // Effect for input value changes or unit changes (when category and mode are stable)
  React.useEffect(() => {
    // This effect should only run if category and mode haven't just changed (handled by above effect)
    if (rhfCategory === selectedCategoryLocal && converterMode === prevConverterModeLocal) {
        const formData = getValues();
        const { category, fromUnit, toUnit, value } = formData;
        const numericValue = Number(value);

        if (category && fromUnit && toUnit && value !== '' && !isNaN(numericValue) && isFinite(numericValue)) {
           setLastValidInputValue(numericValue);
           const result = convertUnits(formData);
           setConversionResult(result);
        } else if (category && fromUnit && toUnit && (value === '' || value === '-')) {
            setConversionResult(null); // Keep last valid input, but no result
            //setIsNormalFormatDisabled(false); // Reset format disable when input is cleared
        } else {
           // Potentially invalid intermediate state, do nothing or clear result
           setConversionResult(null);
           // setIsNormalFormatDisabled(false);
        }
    }
  }, [rhfValue, rhfFromUnit, rhfToUnit, rhfCategory, converterMode, selectedCategoryLocal, prevConverterModeLocal, getValues, convertUnits]);


   React.useEffect(() => {
     // Initial setup only if selectedCategoryLocal is not yet set
     if (selectedCategoryLocal === "") { 
        const initialFormData = getValues();
        const initialCategory = initialFormData.category as UnitCategory;
        
        setSelectedCategoryLocal(initialCategory);
        setPrevConverterModeLocal(converterMode);

        const initialAvailableUnits = getUnitsForCategoryAndMode(initialCategory, converterMode);
        let initialFrom = initialFormData.fromUnit;
        let initialTo = initialFormData.toUnit;

        // Set specific defaults for initial load if needed (e.g. Mass: kg to g)
        if (initialCategory === 'Mass' && initialFormData.fromUnit === 'kg' && initialFormData.toUnit !== 'g') {
           initialTo = 'g';
           setValue("toUnit", initialTo, { shouldValidate: false });
        } else {
            if (!initialAvailableUnits.some(u => u.symbol === initialFrom)) {
                initialFrom = initialAvailableUnits[0]?.symbol || "";
                setValue("fromUnit", initialFrom, { shouldValidate: false });
            }
            if (!initialAvailableUnits.some(u => u.symbol === initialTo) || initialFrom === initialTo) {
                initialTo = initialAvailableUnits.find(u => u.symbol !== initialFrom)?.symbol || initialFrom;
                if (initialFrom === initialTo && initialAvailableUnits.length > 1) {
                     initialTo = initialAvailableUnits[1]?.symbol || initialFrom;
                }
                setValue("toUnit", initialTo, { shouldValidate: false });
            }
        }
        
        const initialValue = (initialFormData.value === undefined || isNaN(Number(initialFormData.value))) ? 1 : Number(initialFormData.value);
        if (String(initialFormData.value) !== String(initialValue)) { // Avoid unnecessary update if already a number
             setValue("value", initialValue, { shouldValidate: false });
        }
        setLastValidInputValue(initialValue);

        const initialResult = convertUnits({...initialFormData, category: initialCategory, fromUnit: initialFrom, toUnit: initialTo, value: initialValue });
        setConversionResult(initialResult);
        setNumberFormat('normal'); 
        setIsNormalFormatDisabled(false); 
     }
   }, []); // Ran once on mount


  const internalHandlePresetSelect = React.useCallback((preset: Preset) => {
    const presetCategory = Object.keys(unitData).find(catKey => catKey === preset.category) as UnitCategory | undefined;
    if (!presetCategory) return;
    
    // Determine if the preset requires advanced mode
    const presetIsAdvancedOnly = unitData[presetCategory].units.find(u => u.symbol === preset.fromUnit || u.symbol === preset.toUnit)?.mode === 'advanced' &&
                                !unitData[presetCategory].units.filter(u => u.mode !== 'advanced').some(u => u.symbol === preset.fromUnit || u.symbol === preset.toUnit);

    let modeForPreset = converterMode;
    if (presetIsAdvancedOnly && converterMode === 'basic') {
        modeForPreset = 'advanced';
        setConverterMode('advanced'); // Update parent state
    } else if (
        !getUnitsForCategoryAndMode(presetCategory, 'basic').some(u => u.symbol === preset.fromUnit || u.symbol === preset.toUnit) &&
        getUnitsForCategoryAndMode(presetCategory, 'advanced').some(u => u.symbol === preset.fromUnit || u.symbol === preset.toUnit) &&
        converterMode === 'basic'
    ) {
        // This handles cases where a unit in a preset is *only* in advanced, even if the category itself has basic units
        modeForPreset = 'advanced';
        setConverterMode('advanced');
    }


    setValue("category", presetCategory, { shouldValidate: true, shouldDirty: true });
    
    // Use a microtask or short timeout to allow state updates (mode, category) to propagate
    Promise.resolve().then(() => {
        const effectiveMode = modeForPreset; // Use the mode determined for this preset
        const availableUnits = getUnitsForCategoryAndMode(presetCategory, effectiveMode);
        
        const fromUnitValid = availableUnits.some(u => u.symbol === preset.fromUnit);
        const toUnitValid = availableUnits.some(u => u.symbol === preset.toUnit);

        const finalFromUnit = fromUnitValid ? preset.fromUnit : availableUnits[0]?.symbol || "";
        let finalToUnit = (toUnitValid && preset.toUnit !== finalFromUnit) ? preset.toUnit : (availableUnits.find(u => u.symbol !== finalFromUnit)?.symbol || finalFromUnit);
         if (finalFromUnit === finalToUnit && availableUnits.length > 1) {
             finalToUnit = availableUnits.find(u=> u.symbol !== finalFromUnit)?.symbol || availableUnits[0]?.symbol || "";
         }

        reset({ 
            category: presetCategory,
            fromUnit: finalFromUnit,
            toUnit: finalToUnit,
            value: 1, 
        });
        setLastValidInputValue(1);
        setNumberFormat('normal'); 
        setIsNormalFormatDisabled(false); 

        // Another microtask for conversion after RHF state from reset is applied
        Promise.resolve().then(() => {
           const result = convertUnits(getValues()); // convertUnits will use the current converterMode prop
           setConversionResult(result);
        });
    });

  }, [setValue, reset, getValues, convertUnits, converterMode, setConverterMode]);


  useImperativeHandle(ref, () => ({
    handlePresetSelect: internalHandlePresetSelect,
  }));


  const swapUnits = React.useCallback(() => {
    setValue("fromUnit", rhfToUnit, { shouldValidate: true });
    setValue("toUnit", rhfFromUnit, { shouldValidate: true });
  }, [rhfFromUnit, rhfToUnit, setValue]);

    const handleActualFormatChange = React.useCallback((
        actualFormat: NumberFormat,
        reason: 'magnitude' | 'user_choice' | null
    ) => {
        const magnitudeForcedScientific = actualFormat === 'scientific' && reason === 'magnitude';
        setIsNormalFormatDisabled(magnitudeForcedScientific);

        if (magnitudeForcedScientific && numberFormat === 'normal') {
            setNumberFormat('scientific'); 
        } else if (!magnitudeForcedScientific && numberFormat === 'scientific' && reason !== 'user_choice'){
            // If magnitude no longer forces scientific, and user didn't explicitly choose it,
            // consider switching back to normal if it's now the default display.
            // This part might need more nuanced logic based on desired UX.
            // For now, if user selected scientific, it stays unless magnitude forces normal.
        }
    }, [numberFormat]); 

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
  };


  return (
     <Card className={cn("shadow-lg flex flex-col", className)} aria-labelledby="unit-converter-title">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle id="unit-converter-title" className="text-2xl font-bold text-primary flex items-center gap-2" as="h2">
              <FlaskConical
                className="h-6 w-6"
                aria-hidden="true"
              />
               Swap Units Converter
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Label htmlFor="mode-toggle" className="text-sm font-medium whitespace-nowrap">
                Advanced Mode
              </Label>
              <Switch
                id="mode-toggle"
                checked={converterMode === 'advanced'}
                onCheckedChange={(checked) => {
                  setConverterMode(checked ? 'advanced' : 'basic');
                }}
                aria-label="Toggle advanced conversion mode"
              />
            </div>
          </div>
          <br className="hidden sm:block"/>
           <p className={cn("text-sm text-muted-foreground mt-1 mb-2 space-y-1", isMobile && "hidden")}>
             Quickly convert between units.
           </p>
           <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
             <li><span className="font-semibold text-primary">Select Category:</span> Choose the type of measurement (e.g., Length, Mass).</li>
             <li><span className="font-semibold text-primary">Choose Units & Input Value:</span> Pick the 'From' and 'To' units, then enter the value you want to convert.</li>
             <li><span className="font-semibold text-primary">View Result:</span> The converted value appears automatically below.</li>
           </ol>
        </CardHeader>
        <CardContent className={cn("pt-0 flex-grow flex flex-col")}>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="flex-grow flex flex-col">
              <div className="space-y-6"> 
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="category-select">Measurement Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="category-select" aria-label="Select measurement category">
                             {field.value && unitData[field.value as UnitCategory] ? ( // Check if field.value is a valid key
                               <div className="flex items-center gap-2">
                                 <UnitIcon category={field.value as UnitCategory} className="h-4 w-4" aria-hidden="true"/>
                                 {unitData[field.value as UnitCategory]?.name ?? 'Select Category'}
                               </div>
                             ) : (
                               <SelectValue placeholder="Select a category" />
                             )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent side="bottom" avoidCollisions={false}>
                          {categoriesForDropdown.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                               <div className="flex items-center gap-2">
                                  <UnitIcon category={cat as UnitCategory} className="h-4 w-4" aria-hidden="true"/>
                                  {unitData[cat as UnitCategory].name}
                               </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the type of unit you want to convert.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {rhfCategory && ( 
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                    <FormField
                      control={form.control}
                      name="fromUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="from-unit-select">From Unit</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                            disabled={!rhfCategory}
                          >
                            <FormControl>
                              <SelectTrigger id="from-unit-select" aria-label="Select the unit to convert from">
                                <SelectValue placeholder="Select input unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getUnitsForCategoryAndMode(rhfCategory, converterMode).map((unit) => (
                                <SelectItem key={unit.symbol} value={unit.symbol}>
                                  {unit.name} ({unit.symbol})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={swapUnits}
                      disabled={!rhfFromUnit || !rhfToUnit}
                      className="h-10 w-full sm:w-10 justify-self-center sm:justify-self-auto" 
                      aria-label="Swap from and to units"
                    >
                      <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>

                    <FormField
                      control={form.control}
                      name="toUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="to-unit-select">To Unit</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                            disabled={!rhfCategory}
                          >
                            <FormControl>
                              <SelectTrigger id="to-unit-select" aria-label="Select the unit to convert to">
                                <SelectValue placeholder="Select output unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getUnitsForCategoryAndMode(rhfCategory, converterMode).map((unit) => (
                                <SelectItem key={unit.symbol} value={unit.symbol}>
                                  {unit.name} ({unit.symbol})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="value-input">Value to Convert</FormLabel>
                      <FormControl>
                        <Input
                          id="value-input"
                          type="text" 
                          inputMode="decimal" 
                          placeholder="Enter value"
                          {...field}
                          onChange={(e) => {
                              const rawValue = e.target.value;
                               if (rawValue === '' || rawValue === '-' || /^-?\d*\.?\d*([eE][-+]?\d*)?$/.test(rawValue)) {
                                  field.onChange(rawValue);
                              }
                          }}
                           value={(field.value === '' || field.value === '-') ? field.value : (isNaN(Number(field.value)) ? '' : String(field.value))}
                          disabled={!rhfFromUnit || !rhfToUnit} 
                          aria-required="true"
                          className="border-primary" 
                        />
                      </FormControl>
                      <FormDescription>Enter the numerical value you wish to convert.</FormDescription>
                      <FormMessage /> 
                    </FormItem>
                  )}
                />
                 <ConversionDisplay
                  fromValue={lastValidInputValue} 
                  fromUnit={rhfFromUnit ?? ''} 
                  result={conversionResult}
                  format={numberFormat}
                  onActualFormatChange={handleActualFormatChange}
                 />

                  <fieldset className="pt-4"> 
                    <legend className="mb-2 block font-medium text-sm">Result Formatting Options</legend>
                     <RadioGroup
                       value={numberFormat}
                       onValueChange={(value: string) => {
                           setNumberFormat(value as NumberFormat);
                       }}
                       className="flex flex-col sm:flex-row gap-4" 
                       aria-label="Choose number format for the result"
                     >
                       <div className="flex items-center space-x-2">
                         <RadioGroupItem
                           value="normal"
                           id="format-normal"
                           disabled={isNormalFormatDisabled} 
                          />
                         <Label
                           htmlFor="format-normal"
                           className={cn(
                             "cursor-pointer text-sm", 
                              isNormalFormatDisabled && "text-muted-foreground opacity-70 cursor-not-allowed" 
                           )}
                         >
                           Normal (e.g., 1,234.56)
                         </Label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <RadioGroupItem value="scientific" id="format-scientific" />
                         <Label htmlFor="format-scientific" className="cursor-pointer text-sm">Scientific (e.g., 1.23E+6)</Label>
                       </div>
                     </RadioGroup>
                  </fieldset>
                </div> 
                <div className="flex-grow"></div> {/* This pushes content up and allows card to match height */}
            </form>
          </Form>
        </CardContent>
      </Card>
  );
}));

UnitConverter.displayName = 'UnitConverter';

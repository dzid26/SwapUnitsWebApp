
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { unitData, presets } from "@/lib/unit-data";
import { type UnitCategory, type Unit, type ConversionResult, type Preset } from "@/types";
import {
  ArrowRightLeft,
} from "lucide-react";
import { PresetList } from "./preset-list";
import { UnitIcon } from "./unit-icon";
import { ConversionDisplay } from "./conversion-display";

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  fromUnit: z.string().min(1, "Please select an input unit"),
  toUnit: z.string().min(1, "Please select an output unit"),
  // Allow empty string or valid positive number
  value: z.union([
     z.literal(''), // Allow empty string
     z.coerce.number({ invalid_type_error: "Please enter a valid number" })
       .positive("Value must be positive")
       .or(z.nan()) // Allow NaN initially or during typing invalid numbers
    ]).optional(), // Make value optional initially
});

type FormData = z.infer<typeof formSchema>;

export function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = React.useState<
    UnitCategory | ""
  >("");
  const [conversionResult, setConversionResult] =
    React.useState<ConversionResult | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // Trigger validation on change
    defaultValues: {
      category: "",
      fromUnit: "",
      toUnit: "",
      value: 1, // Default to 1, but allow empty/invalid during typing
    },
  });

  const { watch, setValue, reset, formState } = form;
  const currentCategory = watch("category");
  const fromUnitValue = watch("fromUnit");
  const toUnitValue = watch("toUnit");
  const inputValue = watch("value");

  const getUnitsForCategory = (category: UnitCategory | ""): Unit[] => {
    return category ? unitData[category]?.units ?? [] : [];
  };

  const availableUnits = getUnitsForCategory(selectedCategory);

  const convertUnits = React.useCallback((data: Partial<FormData>): ConversionResult | null => {
    const { category, fromUnit, toUnit, value } = data;

    if (!category || !fromUnit || !toUnit || value === undefined || value === null || isNaN(Number(value)) || value === '') {
        return null;
    }

    const currentUnits = getUnitsForCategory(category as UnitCategory);
    const fromUnitData = currentUnits.find((u) => u.symbol === fromUnit);
    const toUnitData = currentUnits.find((u) => u.symbol === toUnit);
    const numericValue = Number(value);

    if (!fromUnitData || !toUnitData || !isFinite(numericValue)) {
      return null;
    }

    // Special handling for temperature
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
      return { value: resultValue, unit: toUnitData.symbol };
    }

    // General conversion using base unit factors
    const valueInBaseUnit = numericValue * fromUnitData.factor;
    const resultValue = valueInBaseUnit / toUnitData.factor;

    return { value: resultValue, unit: toUnitData.symbol };
  }, []); // Add empty dependency array as getUnitsForCategory is stable based on imports


  // Effect to handle category changes
  React.useEffect(() => {
    if (currentCategory !== selectedCategory) {
      setSelectedCategory(currentCategory as UnitCategory);
      setValue("fromUnit", "");
      setValue("toUnit", "");
      setConversionResult(null);
    }
  }, [currentCategory, selectedCategory, setValue]);

  // Effect for automatic conversion on value/unit changes
  React.useEffect(() => {
    // Only calculate if the form is valid or if the only error is the value field being empty/invalid temporarily
    const isReadyToCalculate = formState.isValid ||
      (Object.keys(formState.errors).length === 1 && formState.errors.value && (inputValue === '' || isNaN(Number(inputValue))));

    if (currentCategory && fromUnitValue && toUnitValue && isReadyToCalculate && inputValue !== undefined && inputValue !== null && !isNaN(Number(inputValue)) && inputValue !== '') {
       const result = convertUnits({
         category: currentCategory as UnitCategory,
         fromUnit: fromUnitValue,
         toUnit: toUnitValue,
         value: Number(inputValue), // Ensure it's a number
       });
       setConversionResult(result);
    } else {
       // Clear result if inputs become invalid or incomplete
       setConversionResult(null);
    }
  }, [inputValue, fromUnitValue, toUnitValue, currentCategory, convertUnits, formState.isValid, formState.errors]);

  const handlePresetSelect = (preset: Preset) => {
    reset({
      category: preset.category,
      fromUnit: preset.fromUnit,
      toUnit: preset.toUnit,
      value: 1, // Reset value to 1 for presets
    });
    // Effect will trigger calculation
  };

  const swapUnits = () => {
    const currentFrom = fromUnitValue;
    const currentTo = toUnitValue;
    setValue("fromUnit", currentTo, { shouldValidate: true }); // Trigger validation
    setValue("toUnit", currentFrom, { shouldValidate: true }); // Trigger validation
     // Effect will trigger recalculation
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
             <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M21.178 14.147a1.5 1.5 0 0 0-2.356-2.356l-2.97 2.97a1.5 1.5 0 0 0 2.356 2.356l2.97-2.97Z"/>
              <path d="m17 10-1.5 1.5"/>
              <path d="M5 5h2v2"/>
              <path d="M17.03 7H12V2h5.031a1.969 1.969 0 0 1 2 1.969V7Z"/>
              <path d="M9 14a5 5 0 1 0 0-10H4v10a5 5 0 0 0 5 5h2V9.97"/>
              <path d="M17 17v-2h-2"/>
              <path d="M7.03 17H12v5H7.031a1.969 1.969 0 0 1-2-1.969V17Z"/>
            </svg>
            Unitopia - Unit Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {/* No need for onSubmit in the form tag anymore */}
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                          field.onChange(value);
                          // Reset dependent fields when category changes
                          setValue("fromUnit", "", { shouldValidate: true });
                          setValue("toUnit", "", { shouldValidate: true });
                          setConversionResult(null); // Clear result on category change
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                           {field.value ? (
                             <div className="flex items-center gap-2">
                               <UnitIcon category={field.value as UnitCategory} className="h-4 w-4"/>
                               {unitData[field.value as UnitCategory]?.name ?? 'Select Category'}
                             </div>
                           ) : (
                             <SelectValue placeholder="Select a category" />
                           )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(unitData).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                             <div className="flex items-center gap-2">
                                <UnitIcon category={cat as UnitCategory} className="h-4 w-4"/>
                                {unitData[cat as UnitCategory].name}
                             </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedCategory && (
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                  <FormField
                    control={form.control}
                    name="fromUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select input unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableUnits.map((unit) => (
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
                    size="icon"
                    onClick={swapUnits}
                    disabled={!fromUnitValue || !toUnitValue}
                    className="mb-1" // Align with form input bottom border
                    aria-label="Swap units"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>

                  <FormField
                    control={form.control}
                    name="toUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select output unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableUnits.map((unit) => (
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
                    <FormLabel>Value to Convert</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter value"
                        {...field}
                        onChange={(e) => {
                            // Handle empty string case for the input
                            const val = e.target.value;
                            if (val === '') {
                                field.onChange(''); // Pass empty string
                            } else {
                                field.onChange(e); // Let react-hook-form handle coercion
                            }
                        }}
                        disabled={!fromUnitValue || !toUnitValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <ConversionDisplay
                 // Pass NaN if input is invalid/empty, let component handle display
                fromValue={ typeof inputValue === 'number' && !isNaN(inputValue) ? inputValue : undefined}
                fromUnit={fromUnitValue ?? ''}
                result={conversionResult}
               />

              {/* Convert Button Removed */}
            </form>
          </Form>
        </CardContent>
      </Card>

      <PresetList onPresetSelect={handlePresetSelect} />
    </div>
  );
}
      
    
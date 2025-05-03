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
import { type UnitCategory, type Unit, type ConversionResult } from "@/types";
import {
  ArrowRightLeft,
  Thermometer,
  Weight,
  Ruler,
  Clock,
  Gauge,
  AreaChart,
  Waves,
  CloudLightning,
} from "lucide-react";
import { PresetList } from "./preset-list";
import { UnitIcon } from "./unit-icon";
import { ConversionDisplay } from "./conversion-display";

const formSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  fromUnit: z.string().min(1, "Please select an input unit"),
  toUnit: z.string().min(1, "Please select an output unit"),
  value: z.coerce
    .number({ invalid_type_error: "Please enter a valid number" })
    .positive("Value must be positive"),
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
    defaultValues: {
      category: "",
      fromUnit: "",
      toUnit: "",
      value: 1,
    },
  });

  const { watch, setValue, reset } = form;
  const currentCategory = watch("category");
  const fromUnitValue = watch("fromUnit");
  const toUnitValue = watch("toUnit");
  const inputValue = watch("value");

  React.useEffect(() => {
    if (currentCategory !== selectedCategory) {
      setSelectedCategory(currentCategory as UnitCategory);
      setValue("fromUnit", "");
      setValue("toUnit", "");
      setConversionResult(null);
    }
  }, [currentCategory, selectedCategory, setValue]);

  const getUnitsForCategory = (category: UnitCategory | ""): Unit[] => {
    return category ? unitData[category]?.units ?? [] : [];
  };

  const availableUnits = getUnitsForCategory(selectedCategory);

  const convertUnits = (data: FormData): ConversionResult | null => {
    if (!selectedCategory) return null;

    const fromUnitData = availableUnits.find(
      (u) => u.symbol === data.fromUnit
    );
    const toUnitData = availableUnits.find((u) => u.symbol === data.toUnit);

    if (!fromUnitData || !toUnitData) return null;

    // Special handling for temperature
    if (selectedCategory === "Temperature") {
      let tempInCelsius: number;
      if (fromUnitData.symbol === "°C") {
        tempInCelsius = data.value;
      } else if (fromUnitData.symbol === "°F") {
        tempInCelsius = (data.value - 32) * (5 / 9);
      } else { // Kelvin
        tempInCelsius = data.value - 273.15;
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
    const valueInBaseUnit = data.value * fromUnitData.factor;
    const resultValue = valueInBaseUnit / toUnitData.factor;

    return { value: resultValue, unit: toUnitData.symbol };
  };

  const onSubmit = (data: FormData) => {
    const result = convertUnits(data);
    setConversionResult(result);
  };

  const handlePresetSelect = (preset: (typeof presets)[0]) => {
    reset({
      category: preset.category,
      fromUnit: preset.fromUnit,
      toUnit: preset.toUnit,
      value: 1, // Reset value to 1 for presets
    });
    // Trigger conversion immediately for presets
    const result = convertUnits({
      category: preset.category,
      fromUnit: preset.fromUnit,
      toUnit: preset.toUnit,
      value: 1,
    });
    setConversionResult(result);
  };

  const swapUnits = () => {
    const currentFrom = fromUnitValue;
    const currentTo = toUnitValue;
    setValue("fromUnit", currentTo);
    setValue("toUnit", currentFrom);
    // Recalculate if value exists
    if (inputValue) {
       const result = convertUnits({
        category: selectedCategory as UnitCategory, // Assume category is selected if units are
        fromUnit: currentTo,
        toUnit: currentFrom,
        value: inputValue,
      });
      setConversionResult(result);
    }
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
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
                    className="mb-1"
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
                        disabled={!fromUnitValue || !toUnitValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <ConversionDisplay
                fromValue={inputValue}
                fromUnit={fromUnitValue}
                result={conversionResult}
               />

              <Button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!form.formState.isValid}
              >
                Convert
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <PresetList onPresetSelect={handlePresetSelect} />
    </div>
  );
}

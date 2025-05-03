import * as React from 'react';
import {
  Thermometer,
  Weight,
  Ruler,
  Clock,
  Gauge,
  AreaChart,
  Waves, // Using Waves for Volume as Cube isn't available
  CloudLightning, // Using CloudLightning for Energy as Bolt isn't available
  HelpCircle, // Default icon
} from 'lucide-react';
import type { UnitCategory } from '@/types';

interface UnitIconProps extends React.SVGProps<SVGSVGElement> {
    category: UnitCategory | string; // Allow string type for flexibility
}

export function UnitIcon({ category, ...props }: UnitIconProps) {
  switch (category as UnitCategory) {
    case 'Length':
      return <Ruler {...props} />;
    case 'Mass':
      return <Weight {...props} />;
    case 'Temperature':
      return <Thermometer {...props} />;
    case 'Time':
      return <Clock {...props} />;
    case 'Pressure':
      return <Gauge {...props} />;
    case 'Area':
        return <AreaChart {...props} />;
    case 'Volume':
        return <Waves {...props} />; // Using Waves as a placeholder
    case 'Energy':
        return <CloudLightning {...props} />; // Using CloudLightning as a placeholder
    default:
      return <HelpCircle {...props} />;
  }
}

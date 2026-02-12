"use client";

import type { ComponentProps } from "react";
import { WeatherWidget as ToolUIWeatherWidget } from "@/components/tool-ui/weather-widget";
import type { WeatherWidgetProps as ToolUIWeatherWidgetProps } from "@/components/tool-ui/weather-widget/schema";

/**
 * WeatherWidget AI Element
 * Wrapper around tool-ui WeatherWidget component for A2UI integration
 */

export interface WeatherData {
  /** Current temperature in specified unit */
  temperature: number;
  /** Temperature unit */
  unit?: "celsius" | "fahrenheit";
  /** Weather condition */
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "partly-cloudy" | "foggy";
  /** Location name */
  location: string;
  /** Humidity percentage (0-100) */
  humidity?: number;
  /** Wind speed */
  windSpeed?: number;
  /** Wind direction */
  windDirection?: string;
  /** Precipitation chance (0-100) */
  precipitation?: number;
  /** UV index (0-11+) */
  uvIndex?: number;
  /** High temperature for the day */
  high?: number;
  /** Low temperature for the day */
  low?: number;
  /** Sunrise time */
  sunrise?: string;
  /** Sunset time */
  sunset?: string;
  /** 7-day forecast */
  forecast?: Array<{
    day: string;
    condition: string;
    high: number;
    low: number;
  }>;
}

export interface WeatherOptions {
  /** Show forecast */
  showForecast?: boolean;
  /** Show details (humidity, wind, etc.) */
  showDetails?: boolean;
  /** Compact layout */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

export type WeatherWidgetProps = ComponentProps<"div"> & {
  data: WeatherData;
  options?: WeatherOptions;
};

export function WeatherWidget({ data, options = {}, ...props }: WeatherWidgetProps) {
  // Map A2UI weather conditions to tool-ui conditions
  const conditionMap: Record<string, any> = {
    "sunny": "clear",
    "cloudy": "cloudy",
    "rainy": "rain",
    "snowy": "snow",
    "stormy": "thunderstorm",
    "partly-cloudy": "partly-cloudy",
    "foggy": "fog",
  };

  // Map A2UI data to tool-ui props structure
  const toolUIProps: ToolUIWeatherWidgetProps = {
    id: "weather-widget",
    location: data.location,
    current: {
      temp: data.temperature,
      tempMin: data.low ?? data.temperature - 5,
      tempMax: data.high ?? data.temperature + 5,
      condition: conditionMap[data.condition] || "clear",
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      windDirection: data.windDirection ? parseFloat(data.windDirection) : undefined,
      precipitation: data.precipitation ?
        (data.precipitation > 75 ? "heavy" : data.precipitation > 50 ? "moderate" : data.precipitation > 25 ? "light" : "none") as any
        : undefined,
    },
    forecast: data.forecast?.map(f => ({
      day: f.day,
      tempMin: f.low,
      tempMax: f.high,
      condition: conditionMap[f.condition] || "clear",
    })) || [],
    unit: data.unit || "celsius",
    className: options.className,
  };

  return <ToolUIWeatherWidget {...toolUIProps} />;
}

"use client";

import { Sun, Cloud, CloudRain, Wind, Thermometer } from "lucide-react";

const MOCK_WEATHER = {
  city: "São Paulo",
  temp: 28,
  condition: "Parcialmente nublado",
  humidity: 65,
  wind: 12,
  icon: Cloud,
  forecast: [
    { day: "Ter", temp: 27, icon: Sun },
    { day: "Qua", temp: 25, icon: CloudRain },
    { day: "Qui", temp: 26, icon: Cloud },
    { day: "Sex", temp: 29, icon: Sun },
    { day: "Sáb", temp: 30, icon: Sun },
  ],
};

export function WeatherWidget() {
  const WeatherIcon = MOCK_WEATHER.icon;

  return (
    <div className="h-full flex flex-col">
      {/* Current weather */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[#6B7280]">{MOCK_WEATHER.city}</p>
          <p className="text-3xl font-bold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
            {MOCK_WEATHER.temp}°C
          </p>
          <p className="text-xs text-[#9BA3B8]">{MOCK_WEATHER.condition}</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.08)] flex items-center justify-center">
          <WeatherIcon size={28} className="text-[#C9A227]" />
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center gap-4 mb-4 text-xs text-[#6B7280]">
        <div className="flex items-center gap-1">
          <Thermometer size={12} />
          <span>Sensação: {MOCK_WEATHER.temp - 2}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <CloudRain size={12} />
          <span>Umidade: {MOCK_WEATHER.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind size={12} />
          <span>{MOCK_WEATHER.wind} km/h</span>
        </div>
      </div>

      {/* 5-day forecast */}
      <div className="border-t border-[rgba(201,162,39,0.06)] pt-3">
        <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-2 font-medium">
          Previsão 5 dias
        </p>
        <div className="flex justify-between">
          {MOCK_WEATHER.forecast.map((day, i) => {
            const DayIcon = day.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#6B7280]">{day.day}</span>
                <DayIcon size={14} className="text-[#C9A227]" />
                <span className="text-xs text-[#E8EDF2] font-medium">
                  {day.temp}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

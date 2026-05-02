"use client";

import type { ComponentProps, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Schedule-X imports
import { useCalendarApp } from "@schedule-x/react";
import { createViewDay, createViewWeek, createViewMonthGrid, createViewMonthAgenda } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventsServicePlugin } from "@schedule-x/events-service";

// Temporal polyfill for date handling
import { Temporal } from "temporal-polyfill";

// Import schemas
import type {
  CalendarData,
  CalendarOptions,
  CalendarEvent,
  CalendarViewType,
} from "@/lib/schemas/calendar.schema";

// --- Types ---

export type CalendarProps = ComponentProps<"div"> & {
  data: CalendarData;
  options?: CalendarOptions;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventCreate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
};

interface CalendarContextValue {
  data: CalendarData;
  options: CalendarOptions;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  calendarApp: ReturnType<typeof useCalendarApp> | null;
  eventsService: any;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("Calendar components must be used within Calendar");
  }
  return context;
};

// Helper to map view type strings to schedule-x view creators
const createViewFromType = (viewType: CalendarViewType) => {
  switch (viewType) {
    case "day":
      return createViewDay();
    case "week":
      return createViewWeek();
    case "month-grid":
      return createViewMonthGrid();
    case "month-agenda":
      return createViewMonthAgenda();
    default:
      return createViewMonthGrid();
  }
};

// --- Calendar Root Component ---

export const Calendar = memo(
  forwardRef<HTMLDivElement, CalendarProps>(
    (
      {
        data,
        options = {},
        onEventClick,
        onEventUpdate,
        className,
        children,
        ...props
      },
      ref
    ) => {
      const [isFullscreen, setIsFullscreen] = useState(false);
      const safeData: CalendarData = data ?? { events: [] };

      // Create events service plugin once and memoize it
      const eventsService = useMemo(() => createEventsServicePlugin(), []);

      // Memoize view configuration
      const viewsConfig = useMemo(() => {
        const views = safeData.views || [safeData.defaultView || "month-grid"];
        const configs = views.map(createViewFromType);
        // Ensure at least one view (schedule-x requires non-empty array)
        if (configs.length === 0) {
          configs.push(createViewMonthGrid());
        }
        return configs as [any, ...any[]];
      }, [safeData.views, safeData.defaultView]);

      // Memoize event transformation
      const scheduleXEvents = useMemo(
        () =>
          safeData.events.map((event) => {
            // Convert date strings to Temporal objects
            // Schedule-X requires Temporal.PlainDate or Temporal.PlainDateTime
            const parseDateTime = (dateStr: string) => {
              try {
                // Check if it's a date-only string (YYYY-MM-DD)
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  return Temporal.PlainDate.from(dateStr);
                }
                // Otherwise treat as date-time
                return Temporal.PlainDateTime.from(dateStr);
              } catch (error) {
                console.error("Failed to parse date:", dateStr, error);
                // Fallback to today
                return Temporal.Now.plainDateISO();
              }
            };

            return {
              id: event.id,
              title: event.title,
              start: parseDateTime(event.start),
              end: parseDateTime(event.end),
              description: event.description,
              location: event.location,
              people: event.people,
              calendarId: event.calendarId,
              _options: event._options,
            };
          }),
        [safeData.events]
      );

      // Memoize calendar config
      const calendarConfig = useMemo(() => {
        const config: any = {
          views: viewsConfig,
          events: scheduleXEvents,
          plugins: [eventsService],
        };

        // Add optional config fields only if defined
        if (safeData.selectedDate) config.selectedDate = safeData.selectedDate;
        if (safeData.config?.locale) config.locale = safeData.config.locale;
        if (safeData.config?.firstDayOfWeek !== undefined) config.firstDayOfWeek = safeData.config.firstDayOfWeek;
        if (safeData.config?.weekOptions) config.weekOptions = safeData.config.weekOptions;
        if (safeData.config?.monthGridOptions) config.monthGridOptions = safeData.config.monthGridOptions;
        if (safeData.config?.dayBoundaries) config.dayBoundaries = safeData.config.dayBoundaries;
        if (safeData.config?.minDate) config.minDate = safeData.config.minDate;
        if (safeData.config?.maxDate) config.maxDate = safeData.config.maxDate;

        // Add callbacks
        config.callbacks = {
          onEventClick: (calendarEvent: any) => {
            if (onEventClick) {
              const event: CalendarEvent = {
                id: calendarEvent.id,
                title: calendarEvent.title,
                start: calendarEvent.start,
                end: calendarEvent.end,
                description: calendarEvent.description,
                location: calendarEvent.location,
                people: calendarEvent.people,
                calendarId: calendarEvent.calendarId,
              };
              onEventClick(event);
            }
          },
          onEventUpdate: (calendarEvent: any) => {
            if (onEventUpdate) {
              const event: CalendarEvent = {
                id: calendarEvent.id,
                title: calendarEvent.title,
                start: calendarEvent.start,
                end: calendarEvent.end,
                description: calendarEvent.description,
                location: calendarEvent.location,
                people: calendarEvent.people,
                calendarId: calendarEvent.calendarId,
              };
              onEventUpdate(event);
            }
          },
        };

        return config;
      }, [
        viewsConfig,
        scheduleXEvents,
        eventsService,
        safeData.selectedDate,
        safeData.config,
        onEventClick,
        onEventUpdate,
      ]);

      const calendar = useCalendarApp(calendarConfig);

      const value: CalendarContextValue = {
        data: safeData,
        options,
        isFullscreen,
        setIsFullscreen,
        calendarApp: calendar,
        eventsService: eventsService,
      };

      if (!data) {
        return (
          <div className="p-8 text-center text-muted-foreground">
            <p>No calendar data provided</p>
          </div>
        );
      }

      return (
        <CalendarContext.Provider value={value}>
          <div
            ref={ref}
            className={cn(
              "calendar-container flex flex-col rounded-lg border bg-card",
              isFullscreen &&
                "fixed inset-0 z-50 m-0 rounded-none",
              className
            )}
            style={{
              width: options.width || "100%",
              height: options.height || 600,
            }}
            {...props}
          >
            {children}
          </div>
        </CalendarContext.Provider>
      );
    }
  )
);

Calendar.displayName = "Calendar";

// --- Calendar Header ---

export type CalendarHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CalendarHeader = memo(
  forwardRef<HTMLDivElement, CalendarHeaderProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-2 border-b p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

CalendarHeader.displayName = "CalendarHeader";

// --- Calendar Title ---

export type CalendarTitleProps = HTMLAttributes<HTMLDivElement>;

export const CalendarTitle = memo(
  forwardRef<HTMLDivElement, CalendarTitleProps>(
    ({ className, children, ...props }, ref) => {
      const { data } = useCalendar();

      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">
            {children || data.title || "Calendar"}
          </h3>
        </div>
      );
    }
  )
);

CalendarTitle.displayName = "CalendarTitle";

// --- Calendar Actions ---

export type CalendarActionsProps = HTMLAttributes<HTMLDivElement>;

export const CalendarActions = memo(
  forwardRef<HTMLDivElement, CalendarActionsProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

CalendarActions.displayName = "CalendarActions";

// --- Calendar Navigation ---

export const CalendarNavigation = memo(() => {
  useCalendar();

  const handlePrevious = useCallback(() => {
    // TODO: Implement navigation when schedule-x exposes API
    console.log("Previous period");
  }, []);

  const handleNext = useCallback(() => {
    // TODO: Implement navigation when schedule-x exposes API
    console.log("Next period");
  }, []);

  const handleToday = useCallback(() => {
    // TODO: Implement navigation when schedule-x exposes API
    console.log("Go to today");
  }, []);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        aria-label="Previous period"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToday}
        className="min-w-[70px]"
      >
        Today
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        aria-label="Next period"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
});

CalendarNavigation.displayName = "CalendarNavigation";

// --- Calendar Fullscreen Button ---

export const CalendarFullscreenButton = memo(() => {
  const { isFullscreen, setIsFullscreen } = useCalendar();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsFullscreen(!isFullscreen)}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

CalendarFullscreenButton.displayName = "CalendarFullscreenButton";

// --- Calendar Copy Button ---

export const CalendarCopyButton = memo(() => {
  const [copied, setCopied] = useState(false);
  const { data } = useCalendar();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy calendar data:", err);
    }
  }, [data]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label="Copy calendar data"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

CalendarCopyButton.displayName = "CalendarCopyButton";

// --- Calendar Content ---

export type CalendarContentProps = HTMLAttributes<HTMLDivElement>;

export const CalendarContent = memo(
  forwardRef<HTMLDivElement, CalendarContentProps>(
    ({ className, ...props }, ref) => {
      const { calendarApp, options } = useCalendar();
      const containerRef = useRef<HTMLDivElement>(null);
      const hasRendered = useRef(false);

      useEffect(() => {
        if (containerRef.current && calendarApp && !hasRendered.current) {
          // Render calendar only once on mount
          try {
            calendarApp.render(containerRef.current);
            hasRendered.current = true;
          } catch (error) {
            console.error("Failed to render calendar:", error);
          }
        }

        // Cleanup on unmount
        return () => {
          if (calendarApp && hasRendered.current) {
            try {
              calendarApp.destroy?.();
            } catch (error) {
              console.error("Failed to destroy calendar:", error);
            }
            hasRendered.current = false;
          }
        };
      }, [calendarApp]);

      return (
        <div
          ref={ref}
          className={cn(
            "calendar-content flex-1 overflow-auto p-4",
            options?.theme === "dark" && "sx-dark-theme",
            className
          )}
          {...props}
        >
          <div
            ref={containerRef}
            className="sx-react-calendar-wrapper"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      );
    }
  )
);

CalendarContent.displayName = "CalendarContent";

// --- Exports ---

export type {
  CalendarData,
  CalendarOptions,
  CalendarEvent,
  CalendarViewType,
} from "@/lib/schemas/calendar.schema";

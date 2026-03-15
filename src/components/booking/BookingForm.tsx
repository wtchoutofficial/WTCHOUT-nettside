"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

export const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Please select an event type"),
  date: z.string().min(1, "Date is required"),
  venue: z.string().min(1, "Venue is required"),
  budget: z.string().optional(),
  details: z.string().min(10, "Details must be at least 10 characters"),
  whyFit: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

const eventTypes = [
  "Festival",
  "Club night",
  "Beach club / Pool party",
  "Private event",
  "Other",
];

const inputStyles =
  "w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-[#b8a690]/50";

const inputTheme = {
  backgroundColor: "#2a2118",
  borderWidth: "1px",
  borderStyle: "solid" as const,
  borderColor: "rgba(212, 165, 116, 0.3)",
  color: "#f5efe6",
};

export default function BookingForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Something went wrong");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{ backgroundColor: "#2a2118", border: "1px solid rgba(212, 165, 116, 0.3)" }}
      >
        <h3 className="mb-2 text-2xl font-bold" style={{ color: "#f5efe6" }}>
          Thanks for reaching out!
        </h3>
        <p style={{ color: "#b8a690" }}>
          If the vibe is right, you&apos;ll hear from me soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Name *
        </label>
        <input
          {...register("name")}
          placeholder="Your full name"
          className={inputStyles}
          style={{
            ...inputTheme,
            boxShadow: errors.name ? "0 0 0 2px #ff6b2c" : "none",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => {
            if (!errors.name) e.currentTarget.style.boxShadow = "none";
          }}
        />
        {errors.name && (
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Email *
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="your@email.com"
          className={inputStyles}
          style={{
            ...inputTheme,
            boxShadow: errors.email ? "0 0 0 2px #ff6b2c" : "none",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => {
            if (!errors.email) e.currentTarget.style.boxShadow = "none";
          }}
        />
        {errors.email && (
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Phone
        </label>
        <input
          {...register("phone")}
          type="tel"
          placeholder="+47 xxx xx xxx"
          className={inputStyles}
          style={inputTheme}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>

      {/* Event type */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Event type *
        </label>
        <select
          {...register("eventType")}
          className={inputStyles}
          style={{
            ...inputTheme,
            boxShadow: errors.eventType ? "0 0 0 2px #ff6b2c" : "none",
          }}
          defaultValue=""
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => {
            if (!errors.eventType) e.currentTarget.style.boxShadow = "none";
          }}
        >
          <option value="" disabled>
            Select type...
          </option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.eventType && (
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>
            {errors.eventType.message}
          </p>
        )}
      </div>

      {/* Date and Venue */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
            Date *
          </label>
          <input
            {...register("date")}
            type="date"
            className={inputStyles}
            style={{
              ...inputTheme,
              colorScheme: "dark",
              boxShadow: errors.date ? "0 0 0 2px #ff6b2c" : "none",
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
            onBlur={(e) => {
              if (!errors.date) e.currentTarget.style.boxShadow = "none";
            }}
          />
          {errors.date && (
            <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
            Venue *
          </label>
          <input
            {...register("venue")}
            placeholder="e.g. Ushuaia, Ibiza"
            className={inputStyles}
            style={{
              ...inputTheme,
              boxShadow: errors.venue ? "0 0 0 2px #ff6b2c" : "none",
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
            onBlur={(e) => {
              if (!errors.venue) e.currentTarget.style.boxShadow = "none";
            }}
          />
          {errors.venue && (
            <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>
              {errors.venue.message}
            </p>
          )}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Budget (optional)
        </label>
        <input
          {...register("budget")}
          placeholder="e.g. 20,000 - 50,000 NOK"
          className={inputStyles}
          style={inputTheme}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>

      {/* Details */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Details *
        </label>
        <textarea
          {...register("details")}
          placeholder="Tell us more about the event..."
          rows={4}
          className={`${inputStyles} resize-y`}
          style={{
            ...inputTheme,
            boxShadow: errors.details ? "0 0 0 2px #ff6b2c" : "none",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => {
            if (!errors.details) e.currentTarget.style.boxShadow = "none";
          }}
        />
        {errors.details && (
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>
            {errors.details.message}
          </p>
        )}
      </div>

      {/* Why is this a good fit */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Why is this a good fit for WTCHOUT? (optional)
        </label>
        <textarea
          {...register("whyFit")}
          placeholder="What makes this event a match for WTCHOUT's sound?"
          rows={3}
          className={`${inputStyles} resize-y`}
          style={inputTheme}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>

      {/* Error message */}
      {status === "error" && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{ backgroundColor: "#ff6b2c15", color: "#ff6b2c", border: "1px solid #ff6b2c40" }}
        >
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" disabled={status === "loading"} className="mt-2 w-full sm:w-auto">
        {status === "loading" ? "Sending..." : "Send inquiry"}
      </Button>
    </form>
  );
}

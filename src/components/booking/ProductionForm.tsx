"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

export const productionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  artistName: z.string().optional(),
  type: z.string().min(1, "Please select a type"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  musicLink: z.string().optional(),
  budget: z.string().optional(),
});

export type ProductionFormData = z.infer<typeof productionSchema>;

const productionTypes = [
  "Collaboration",
  "Buy a beat",
  "Production help",
  "Other",
];

const inputStyles =
  "w-full rounded-lg px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-[#b8a690]/50";

const inputTheme = {
  backgroundColor: "#2a2118",
  borderWidth: "1px",
  borderStyle: "solid" as const,
  borderColor: "rgba(212, 165, 116, 0.3)",
  color: "#f5efe6",
};

export default function ProductionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
  });

  const onSubmit = async (data: ProductionFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, category: "production" }),
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
          I&apos;ll get back to you about this soon.
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
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>{errors.name.message}</p>
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
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>{errors.email.message}</p>
        )}
      </div>

      {/* Artist name */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Artist name
        </label>
        <input
          {...register("artistName")}
          placeholder="Your artist/stage name"
          className={inputStyles}
          style={inputTheme}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>

      {/* Type */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Type *
        </label>
        <select
          {...register("type")}
          className={inputStyles}
          style={{
            ...inputTheme,
            boxShadow: errors.type ? "0 0 0 2px #ff6b2c" : "none",
          }}
          defaultValue=""
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => {
            if (!errors.type) e.currentTarget.style.boxShadow = "none";
          }}
        >
          <option value="" disabled>Select type...</option>
          {productionTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>{errors.type.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Describe the project *
        </label>
        <textarea
          {...register("description")}
          placeholder="Tell me about what you have in mind..."
          rows={4}
          className={`${inputStyles} resize-y`}
          style={{
            ...inputTheme,
            boxShadow: errors.description ? "0 0 0 2px #ff6b2c" : "none",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => {
            if (!errors.description) e.currentTarget.style.boxShadow = "none";
          }}
        />
        {errors.description && (
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>{errors.description.message}</p>
        )}
      </div>

      {/* Music link */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Link to your music
        </label>
        <input
          {...register("musicLink")}
          placeholder="Spotify, SoundCloud, etc."
          className={inputStyles}
          style={inputTheme}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>

      {/* Budget */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Budget (optional)
        </label>
        <input
          {...register("budget")}
          placeholder="e.g. 5,000 - 15,000 NOK"
          className={inputStyles}
          style={inputTheme}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>

      {/* Error */}
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

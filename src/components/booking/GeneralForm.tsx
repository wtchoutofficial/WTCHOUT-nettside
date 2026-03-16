"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

export const generalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  organization: z.string().optional(),
  type: z.string().min(1, "Please select a type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type GeneralFormData = z.infer<typeof generalSchema>;

const generalTypes = [
  "Interview",
  "Label inquiry",
  "Invitation",
  "Sponsorship",
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

export default function GeneralForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
  });

  const onSubmit = async (data: GeneralFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, category: "general" }),
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
          I&apos;ll get back to you as soon as I can.
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

      {/* Organization */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Organization / Company
        </label>
        <input
          {...register("organization")}
          placeholder="e.g. Vice, Spinnin' Records"
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
          {generalTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>{errors.type.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block text-sm font-medium" style={{ color: "#d4a574" }}>
          Message *
        </label>
        <textarea
          {...register("message")}
          placeholder="What would you like to discuss?"
          rows={4}
          className={`${inputStyles} resize-y`}
          style={{
            ...inputTheme,
            boxShadow: errors.message ? "0 0 0 2px #ff6b2c" : "none",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ff6b2c")}
          onBlur={(e) => {
            if (!errors.message) e.currentTarget.style.boxShadow = "none";
          }}
        />
        {errors.message && (
          <p className="mt-1 text-xs" style={{ color: "#ff6b2c" }}>{errors.message.message}</p>
        )}
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
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}

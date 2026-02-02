import React from 'react';
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";

interface HPHRadioProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  label?: string;
}

export const HPHRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    />
  );
});

export const HPHRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { label?: string }
>(({ className, label, ...props }, ref) => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "aspect-square h-5 w-5 rounded-full border border-input text-primary shadow-sm",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          "hover:border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <CircleIcon className="h-2.5 w-2.5 fill-primary text-primary" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && (
        <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      )}
    </div>
  );
});

HPHRadioGroup.displayName = "HPHRadioGroup";
HPHRadioItem.displayName = "HPHRadioItem";

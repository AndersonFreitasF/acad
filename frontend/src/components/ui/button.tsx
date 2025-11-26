import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-heading ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-3 border-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-neo-sm",
  {
    variants: {
      variant: {
        default: "bg-neo-blue text-white",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "bg-white text-black hover:bg-neo-light",
        secondary: "bg-neo-purple text-white",
        ghost:
          "shadow-none border-transparent hover:bg-accent hover:text-accent-foreground hover:shadow-none hover:translate-x-0 hover:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline shadow-none border-none hover:translate-x-0 hover:translate-y-0",
        brutal: "bg-neo-yellow text-black",
        success: "bg-neo-green text-black",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 rounded-md px-4",
        lg: "h-14 rounded-base px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

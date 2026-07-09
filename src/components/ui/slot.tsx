import * as React from "react";

/**
 * Minimal `asChild` slot: merges the component's props onto its single React
 * element child. Avoids pulling in @radix-ui just for this one behaviour.
 */
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...props,
      ...child.props,
      ref,
      className: [
        (props as { className?: string }).className,
        (child.props as { className?: string }).className,
      ]
        .filter(Boolean)
        .join(" "),
    });
  },
);
Slot.displayName = "Slot";

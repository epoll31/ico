import { Size } from "@/lib/types";

export default function spreadSizes<T>(value: T): Record<Size, T> {
  return {
    16: value,
    24: value,
    32: value,
    48: value,
    64: value,
    128: value,
    256: value,
  };
}

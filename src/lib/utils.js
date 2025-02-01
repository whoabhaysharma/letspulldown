import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function isGymOwner(user) {
  return user?.role === 'gym_owner';
}

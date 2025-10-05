// Common types used throughout the application

export interface ButtonProps {
  variant: "button-primary" | "button-secondary";
  buttonText: string;
  buttonLink?: string;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  iconlink: string;
  headingOne: string;
  paragraph: string;
  linkToService?: string;
  className?: string;
}

export interface SpecialCardProps {
  headingOne: string;
  paragraph: string;
  iconlink: string;
  className?: string;
}

export interface SermonCardProps {
  // Required props
  image: string;
  title: string;
  description: string;

  // Optional props with better defaults
  name?: string;
  link?: string;
  time?: {
    day: string;
    start: string;
    end: string;
  };
  location?: string;
  speaker?: string;
  date?: string;
  category?: string;

  // Styling and behavior
  className?: string;
  variant?: "default" | "compact" | "featured";
  showTime?: boolean;
  showLocation?: boolean;
  showSpeaker?: boolean;
  showDate?: boolean;
  showImage?: boolean;

  // Button customization
  buttonText?: string;
  buttonVariant?: "button-primary" | "button-secondary";
}

export interface ServiceTime {
  day: string;
  start: string;
  end: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  time: ServiceTime;
  zoomLink?: string;
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface Sermon {
  id: string;
  title: string;
  description: string;
  date: string;
  speaker: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnail: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
}

export interface NavigationItem {
  path: string;
  label: string;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

import { NavigationItem, Service, Ministry } from "../types";

// Navigation items
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { path: "/", label: "HOME" },
  { path: "/bulletin", label: "BULLETIN & PRAYER" },
  { path: "/sermon", label: "SERMONS" },
  { path: "/contact", label: "CONTACT US" },
  { path: "/about", label: "ABOUT US" },
];

// Weekly services data
export const WEEKLY_SERVICES: Service[] = [
  {
    id: "breaking-of-bread",
    name: "BREAKING OF BREAD",
    description:
      "Join us for our weekly breaking of bread service where we remember the Lord's death and resurrection.",
    icon: "/assets/prayingiconround.svg",
    time: { day: "Sunday", start: "9:30 AM", end: "10:30 AM" },
    zoomLink:
      "https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09",
  },
  {
    id: "family-bible-hour",
    name: "FAMILY BIBLE HOUR",
    description: "A time for family Bible study and fellowship together.",
    icon: "/assets/bible.svg",
    time: { day: "Sunday", start: "11:00 AM", end: "12:00 PM" },
    zoomLink:
      "https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09",
  },
  {
    id: "estudio-biblico",
    name: "ESTUDIO BÍBLICO",
    description: "Spanish Bible study for our Spanish-speaking community.",
    icon: "/assets/breakingofbread.svg",
    time: { day: "Sunday", start: "12:30 PM", end: "1:30 PM" },
    zoomLink:
      "https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09",
  },
];

// Special ministries data
export const SPECIAL_MINISTRIES: Ministry[] = [
  {
    id: "sunday-school",
    name: "SUNDAY SCHOOL CLASS",
    description:
      "Weekly kids club, Sundays from 11:30 am to 12:30 pm, for children ages 8 through 14.",
    icon: "/assets/sundaySchool.png",
    isActive: true,
  },
  {
    id: "spanish-bible-study",
    name: "SPANISH BIBLE STUDY",
    description: "Weekly Spanish Bible study for adults and families.",
    icon: "/assets/spanishBible.png",
    isActive: true,
  },
  {
    id: "esl",
    name: "ESL (CANCELLED)",
    description: "English as a Second Language classes - currently on hold.",
    icon: "/assets/ESL.png",
    isActive: false,
  },
];

// Church information
export const CHURCH_INFO = {
  name: "10TH AVE BIBLE CHAPEL",
  tagline: "A SMALL BIBLE BELIEVING CHRISTIAN FELLOWSHIP",
  welcomeMessage: "WELCOME TO OUR CHURCH",
  john316: {
    reference: "JOHN 3:16",
    verse:
      '"FOR GOD SO LOVED THE WORLD THAT HE GAVE HIS ONLY BEGOTTEN SON, THAT WHOEVER BELIEVES IN HIM SHOULD NOT PERISH BUT HAVE EVERLASTING LIFE."',
  },
};

// Contact information
export const CONTACT_INFO = {
  phone: "+1 (604) 222-7777",
  email: "info@10thavebiblechapel.com",
  address: "123 10th Avenue, Vancouver, BC V5Y 1K8",
  mapUrl: "https://maps.google.com/?q=10th+Avenue+Bible+Chapel",
};

// Scroll reveal configuration
export const SCROLL_REVEAL_CONFIG = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

// Event categories and colors
export const EVENT_CATEGORIES = [
  {
    id: "worship",
    name: "Worship Service",
    color: "#8B4513", // Saddle Brown
    description: "Regular worship services and church meetings",
  },
  {
    id: "prayer",
    name: "Prayer Meeting",
    color: "#4B0082", // Indigo
    description: "Prayer meetings and spiritual gatherings",
  },
  {
    id: "youth",
    name: "Youth Group",
    color: "#FF6347", // Tomato
    description: "Youth activities and meetings",
  },
  {
    id: "bible-study",
    name: "Bible Study",
    color: "#2E8B57", // Sea Green
    description: "Bible study sessions and classes",
  },
  {
    id: "fellowship",
    name: "Fellowship",
    color: "#FF8C00", // Dark Orange
    description: "Social gatherings and fellowship events",
  },
  {
    id: "ministry",
    name: "Ministry",
    color: "#4169E1", // Royal Blue
    description: "Ministry activities and outreach",
  },
  {
    id: "special",
    name: "Special Event",
    color: "#DC143C", // Crimson
    description: "Special occasions and celebrations",
  },
  {
    id: "meeting",
    name: "Meeting",
    color: "#696969", // Dim Gray
    description: "Administrative and planning meetings",
  },
];

// Default event color
export const DEFAULT_EVENT_COLOR = "#FBCB9C"; // Light orange from your theme

// Predefined color options for events
export const EVENT_COLORS = [
  { id: "default", name: "Default", value: "#FBCB9C" },
  { id: "blue", name: "Blue", value: "#4169E1" },
  { id: "green", name: "Green", value: "#2E8B57" },
  { id: "red", name: "Red", value: "#DC143C" },
  { id: "purple", name: "Purple", value: "#4B0082" },
];

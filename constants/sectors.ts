export const SECTORS = [
  { value: "agritech", label: "Agritech", icon: "Sprout", description: "Agriculture & food technology solutions" },
  { value: "fintech", label: "Fintech", icon: "Banknote", description: "Financial services & payments" },
  { value: "edtech", label: "Edtech", icon: "GraduationCap", description: "Education technology & e-learning" },
  { value: "healthtech", label: "Healthtech", icon: "Stethoscope", description: "Healthcare & medical innovation" },
  { value: "logistics", label: "Logistics", icon: "Truck", description: "Supply chain, transport & delivery" },
  { value: "manufacturing", label: "Manufacturing", icon: "Factory", description: "Production & industrial technology" },
  { value: "ecommerce", label: "E-Commerce", icon: "ShoppingCart", description: "Online retail & marketplace" },
  { value: "cleantech", label: "Cleantech", icon: "Wind", description: "Clean energy & sustainability" },
  { value: "ictservices", label: "ICT Services", icon: "Cpu", description: "Software, IT consulting & digital" },
  { value: "creative", label: "Creative", icon: "Palette", description: "Media, design & creative industries" },
  { value: "realtech", label: "Real Estate", icon: "Building2", description: "Property & construction tech" },
  { value: "foodtech", label: "Foodtech", icon: "UtensilsCrossed", description: "Food, beverage & restaurant tech" },
  { value: "other", label: "Other", icon: "MoreHorizontal", description: "Other innovative ventures" },
];

export const SECTOR_MAP = Object.fromEntries(
  SECTORS.map((s) => [s.value, s.label])
);

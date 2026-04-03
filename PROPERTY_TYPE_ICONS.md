# Property Type Icon Reference

## Icon Mappings

| Property Type | Enum Value | Icon Component | Visual Description |
|--------------|------------|----------------|-------------------|
| Hotel | `HOTEL` | `Building2` | Multi-story building icon |
| Apartment | `APARTMENT` | `Home` | House/home icon |
| Resort | `RESORT` | `Palmtree` | Palm tree icon (tropical) |
| Villa | `VILLA` | `Castle` | Castle/mansion icon |
| Guest House | `GUEST_HOUSE` | `DoorOpen` | Open door icon |
| Hostel | `HOSTEL` | `Bed` | Bed icon |
| Lodge | `LODGE` | `TreePine` | Pine tree icon (nature) |

## Usage in Code

### Filter Sidebar
```tsx
const PROPERTY_TYPE_CATEGORIES = [
  { value: "HOTEL", label: "Hotel", icon: Building2 },
  { value: "APARTMENT", label: "Apartment", icon: Home },
  { value: "RESORT", label: "Resort", icon: Palmtree },
  { value: "VILLA", label: "Villa", icon: Castle },
  { value: "GUEST_HOUSE", label: "Guest House", icon: DoorOpen },
  { value: "HOSTEL", label: "Hostel", icon: Bed },
  { value: "LODGE", label: "Lodge", icon: TreePine },
];
```

### Property Card
```tsx
const getPropertyTypeIcon = (propertyType: string) => {
  const iconMap: Record<string, any> = {
    HOTEL: Building2,
    APARTMENT: Home,
    RESORT: Palmtree,
    VILLA: Castle,
    GUEST_HOUSE: DoorOpen,
    HOSTEL: Bed,
    LODGE: TreePine,
  };
  return iconMap[propertyType] || Building2;
};
```

## Icon Sizes

- **Filter Sidebar**: `w-4 h-4` (16x16px)
- **Property Card Badge**: `w-3 h-3` (12x12px)

## Color Scheme

- **Default**: `text-muted-foreground` (gray)
- **Hover**: `text-primary` (brand color)
- **Badge**: Inherits from Badge component styling

## Accessibility

All icons are accompanied by text labels for screen readers:
- Filter checkboxes have visible labels
- Property card badges show both icon and text

## Design Rationale

| Type | Icon Choice | Reasoning |
|------|-------------|-----------|
| Hotel | Building2 | Represents commercial multi-story buildings |
| Apartment | Home | Represents residential living spaces |
| Resort | Palmtree | Evokes vacation/tropical destinations |
| Villa | Castle | Suggests luxury/upscale properties |
| Guest House | DoorOpen | Represents welcoming, home-like stays |
| Hostel | Bed | Emphasizes shared sleeping arrangements |
| Lodge | TreePine | Suggests nature/mountain retreats |

## Alternative Icons Considered

If you want to change icons in the future, here are alternatives:

| Type | Current | Alternatives |
|------|---------|--------------|
| Hotel | Building2 | Building, Hotel, Home |
| Apartment | Home | Building, House |
| Resort | Palmtree | Waves, Sun, Umbrella |
| Villa | Castle | Home, Building2, Crown |
| Guest House | DoorOpen | Home, Users, Heart |
| Hostel | Bed | Users, Building, Home |
| Lodge | TreePine | Mountain, Trees, Tent |

## Implementation Notes

1. All icons are from `lucide-react` package
2. Icons are tree-shakeable (only imported icons are bundled)
3. Icons support all lucide-react props (size, color, strokeWidth, etc.)
4. Icons are SVG-based (scalable and performant)

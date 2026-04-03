# Property Type Filter - Developer Guide

## Quick Start

### Adding a New Property Type

If you need to add a new property type in the future:

#### 1. Update Database Schema
```prisma
// backend/prisma/models/property.schema.prisma
enum PropertyType {
  APARTMENT
  HOTEL
  RESORT
  VILLA
  GUEST_HOUSE
  HOSTEL
  LODGE
  NEW_TYPE  // Add your new type here
}
```

Run migration:
```bash
cd backend
npx prisma migrate dev --name add_new_property_type
```

#### 2. Update Frontend Types
```typescript
// web/src/types/property.types.ts
export type PropertyCategory = 
  | "HOTEL" 
  | "APARTMENT" 
  | "RESORT" 
  | "VILLA" 
  | "GUEST_HOUSE" 
  | "HOSTEL" 
  | "LODGE"
  | "NEW_TYPE";  // Add here
```

#### 3. Add Icon Mapping
```typescript
// web/src/components/shared/filter/filter-sidebar.tsx
import { ..., NewIcon } from "lucide-react";

const PROPERTY_TYPE_CATEGORIES = [
  // ... existing types
  { value: "NEW_TYPE", label: "New Type", icon: NewIcon },
];
```

#### 4. Update Property Card
```typescript
// web/src/components/shared/property-card/index.tsx
const getPropertyTypeIcon = (propertyType: string) => {
  const iconMap: Record<string, any> = {
    // ... existing mappings
    NEW_TYPE: NewIcon,
  };
  return iconMap[propertyType] || Building2;
};

const getPropertyTypeLabel = (propertyType: string) => {
  const labelMap: Record<string, string> = {
    // ... existing mappings
    NEW_TYPE: "New Type",
  };
  return labelMap[propertyType] || propertyType;
};
```

## Architecture Overview

### Data Flow

```
User clicks checkbox
    ↓
FilterSidebar updates URL params
    ↓
React Router detects URL change
    ↓
PropertiesPage reads new params
    ↓
useGetProperties hook makes API call
    ↓
Backend filters properties
    ↓
Results returned to frontend
    ↓
DataContainer renders filtered cards
```

### Component Hierarchy

```
PropertiesPage
├── SearchBar
├── DataContainer
│   ├── FilterSidebar
│   │   └── Property Category Section
│   └── PropertyCard (multiple)
│       └── Property Type Badge
└── PaginationControls
```

## API Reference

### Endpoint
```
GET /api/v1/properties
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `propertyTypes` | `string` | JSON array of property types | `["HOTEL","VILLA"]` |
| `city` | `string` | City name | `Addis Ababa` |
| `minPrice` | `number` | Minimum price | `1000` |
| `maxPrice` | `number` | Maximum price | `5000` |
| `page` | `number` | Page number | `1` |
| `limit` | `number` | Items per page | `10` |

### Request Example
```bash
curl "http://localhost:3000/api/v1/properties?propertyTypes=[%22HOTEL%22,%22RESORT%22]&city=Addis%20Ababa"
```

### Response Example
```json
{
  "data": [
    {
      "id": "123",
      "name": "Luxury Hotel",
      "type": "HOTEL",
      "address": "Bole, Addis Ababa",
      "images": [...],
      "facilities": [...],
      "averageRating": 4.5,
      "reviewCount": 120
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "limit": 10,
    "hasMore": true
  }
}
```

## State Management

### URL as Single Source of Truth

The filter state is stored in URL parameters, not in React state. This provides:
- ✅ Shareable URLs
- ✅ Browser back/forward support
- ✅ Bookmark support
- ✅ No state synchronization issues

### Reading Filters
```typescript
const [searchParams] = useSearchParams();

// Parse property types from URL
const currentTypes: string[] = (() => {
  try {
    const param = searchParams.get("propertyTypes");
    return param ? JSON.parse(param) : [];
  } catch {
    return [];
  }
})();
```

### Updating Filters
```typescript
const applyFilter = (key: string, value: any) => {
  const p = new URLSearchParams(searchParams);
  
  if (value === undefined || value === null) {
    p.delete(key);
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      p.delete(key);
    } else {
      p.set(key, JSON.stringify(value));
    }
  } else {
    p.set(key, String(value));
  }
  
  navigate(`/properties?${p.toString()}`);
};
```

## Styling Guide

### Filter Sidebar

```tsx
// Section container
<div className="space-y-2">
  
  // Checkbox label
  <label className="flex items-center gap-2 cursor-pointer group">
    
    // Checkbox
    <Checkbox checked={isChecked} />
    
    // Icon (with hover effect)
    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    
    // Label text
    <span className="text-sm">{label}</span>
  </label>
</div>
```

### Property Card Badge

```tsx
// Vertical card (top-left corner)
<div className="absolute top-3 left-3 flex items-center gap-1.5">
  <Badge className="text-xs font-medium flex items-center gap-1">
    <Icon className="w-3 h-3" />
    {label}
  </Badge>
</div>

// Horizontal card (next to name)
<div className="flex items-center gap-2">
  <h3>{name}</h3>
  <Badge variant="secondary" className="text-xs font-medium flex items-center gap-1 shrink-0">
    <Icon className="w-3 h-3" />
    {label}
  </Badge>
</div>
```

## Performance Optimization

### Current Optimizations

1. **Debounced API Calls**: URL changes trigger immediate navigation, but API calls are managed by React Query
2. **Memoization**: Filter parsing is done inline to avoid unnecessary re-renders
3. **Lazy Loading**: Icons are tree-shaken (only used icons are bundled)
4. **Efficient Queries**: Backend uses indexed database queries

### Future Optimizations

1. **Property Type Counts**: Cache counts in Redis
2. **Prefetching**: Prefetch common filter combinations
3. **Virtual Scrolling**: For large result sets
4. **Service Worker**: Cache property type metadata

## Debugging

### Common Issues

#### 1. Filter Not Working
```typescript
// Check URL params
console.log('URL params:', Object.fromEntries(searchParams));

// Check parsed types
console.log('Parsed types:', currentTypes);

// Check API request
console.log('API request:', filters);
```

#### 2. Badge Not Showing
```typescript
// Check property type value
console.log('Property type:', data.type);

// Check icon mapping
console.log('Icon:', getPropertyTypeIcon(data.type));

// Check label mapping
console.log('Label:', getPropertyTypeLabel(data.type));
```

#### 3. Backend Filter Not Applied
```typescript
// Check query param
console.log('propertyTypes param:', req.query.propertyTypes);

// Check parsed array
console.log('Parsed array:', typesArray);

// Check Prisma filter
console.log('Prisma filter:', filters);
```

### Debug Mode

Enable debug logging:

```typescript
// Frontend
const DEBUG = true;

if (DEBUG) {
  console.log('[PropertyFilter]', {
    currentTypes,
    searchParams: Object.fromEntries(searchParams),
    filters,
  });
}

// Backend
console.log('[PropertyController]', {
  propertyTypes: req.query.propertyTypes,
  parsedTypes: typesArray,
  filters,
});
```

## Testing

### Unit Tests

```typescript
// Test filter parsing
describe('PropertyFilter', () => {
  it('should parse property types from URL', () => {
    const url = new URLSearchParams('propertyTypes=["HOTEL","VILLA"]');
    const types = JSON.parse(url.get('propertyTypes') || '[]');
    expect(types).toEqual(['HOTEL', 'VILLA']);
  });
});

// Test icon mapping
describe('getPropertyTypeIcon', () => {
  it('should return correct icon for HOTEL', () => {
    const icon = getPropertyTypeIcon('HOTEL');
    expect(icon).toBe(Building2);
  });
  
  it('should return default icon for unknown type', () => {
    const icon = getPropertyTypeIcon('UNKNOWN');
    expect(icon).toBe(Building2);
  });
});
```

### Integration Tests

```typescript
// Test filter + API
describe('Property Type Filter Integration', () => {
  it('should filter properties by type', async () => {
    const response = await api.get('/properties', {
      params: { propertyTypes: JSON.stringify(['HOTEL']) }
    });
    
    expect(response.data.data).toHaveLength(10);
    expect(response.data.data.every(p => p.type === 'HOTEL')).toBe(true);
  });
});
```

## Security Considerations

### Input Validation

```typescript
// Backend validation
if (propertyTypes) {
  try {
    const typesArray = JSON.parse(propertyTypes as string);
    
    // Validate array
    if (!Array.isArray(typesArray)) {
      throw new Error('Invalid format');
    }
    
    // Validate enum values
    const validTypes = ['HOTEL', 'APARTMENT', 'RESORT', 'VILLA', 'GUEST_HOUSE', 'HOSTEL', 'LODGE'];
    const sanitized = typesArray.filter(t => validTypes.includes(t));
    
    if (sanitized.length > 0) {
      filters.AND.push({ type: { in: sanitized } });
    }
  } catch (error) {
    console.error('Invalid propertyTypes:', error);
    // Don't apply filter if invalid
  }
}
```

### SQL Injection Prevention

✅ Using Prisma ORM prevents SQL injection
✅ All inputs are parameterized
✅ No raw SQL queries with user input

## Maintenance

### Regular Tasks

1. **Monitor Performance**: Check API response times
2. **Update Icons**: Keep lucide-react updated
3. **Review Analytics**: Track which types are most filtered
4. **Update Documentation**: Keep this guide current

### Deprecation Plan

If you need to remove a property type:

1. Mark as deprecated in schema
2. Hide from filter UI
3. Keep backend support for 6 months
4. Remove from database after migration period

## Support

### Getting Help

- Check console for errors
- Review this guide
- Check implementation files
- Review test checklist
- Contact team lead

### Reporting Issues

Use the bug template in TESTING_CHECKLIST.md

## Resources

- [Lucide Icons](https://lucide.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Router](https://reactrouter.com/)
- [Radix UI](https://www.radix-ui.com/)

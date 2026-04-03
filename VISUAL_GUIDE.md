# Visual Guide - Property Type Filtering System

## 1. Hero Section - Before & After

### Before:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         [Search Box floating left-right animation]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### After:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              [Search Box - Centered & Static]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Changes:**
- Removed floating animation
- Centered with `max-w-5xl mx-auto px-4`
- Improved user experience (no distracting movement)

---

## 2. Header Navigation - Dynamic Label

### Default State:
```
┌──────────────────────────────────────────────────────────┐
│  Logo  [Home] [Properties ▼] [About] [Contact]  [Login] │
└──────────────────────────────────────────────────────────┘
```

### When Hotels Selected:
```
┌──────────────────────────────────────────────────────────┐
│  Logo  [Home] [Hotels ▼] [About] [Contact]      [Login] │
└──────────────────────────────────────────────────────────┘
```

### When Guest Houses Selected:
```
┌──────────────────────────────────────────────────────────┐
│  Logo  [Home] [Guest Houses ▼] [About] [Contact] [Login]│
└──────────────────────────────────────────────────────────┘
```

**Dropdown Menu:**
```
┌─────────────────────────┐
│ 🏢 All Properties       │
│ 🏨 Hotels          ✓    │ ← Active (highlighted)
│ 🏠 Apartments           │
│ 🌴 Resorts              │
│ 🏰 Villas               │
│ 🚪 Guest Houses         │
│ 🛏️  Hostels             │
│ 🌲 Lodges               │
└─────────────────────────┘
```

---

## 3. Properties Page - Dynamic Heading

### No Filter:
```
┌─────────────────────────────────────────────────────────┐
│  All Properties                                         │
│  ─────────────────                                      │
│  100 properties found                                   │
│                                                         │
│  [Property Card 1]                                      │
│  [Property Card 2]                                      │
└─────────────────────────────────────────────────────────┘
```

### Hotels Selected:
```
┌─────────────────────────────────────────────────────────┐
│  Hotels                                                 │
│  ──────                                                 │
│  45 hotels found                                        │
│                                                         │
│  [Hotel Card 1]                                         │
│  [Hotel Card 2]                                         │
└─────────────────────────────────────────────────────────┘
```

### Hotels in Addis Ababa:
```
┌─────────────────────────────────────────────────────────┐
│  Hotels in Addis Ababa                                  │
│  ──────────────────────                                 │
│  23 hotels found in Addis Ababa                         │
│                                                         │
│  [Hotel Card 1 - Addis Ababa]                           │
│  [Hotel Card 2 - Addis Ababa]                           │
└─────────────────────────────────────────────────────────┘
```

### Multiple Types Selected:
```
┌─────────────────────────────────────────────────────────┐
│  Hotels & Apartments                                    │
│  ────────────────────                                   │
│  67 properties found                                    │
│                                                         │
│  [Hotel Card 1]                                         │
│  [Apartment Card 1]                                     │
└─────────────────────────────────────────────────────────┘
```

### Three or More Types:
```
┌─────────────────────────────────────────────────────────┐
│  Multiple Property Types                                │
│  ────────────────────────                               │
│  89 properties found                                    │
│                                                         │
│  [Hotel Card 1]                                         │
│  [Apartment Card 1]                                     │
│  [Resort Card 1]                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Filter Sidebar - Property Type Selection

```
┌─────────────────────────┐
│  Filters         [Reset]│
├─────────────────────────┤
│                         │
│  Property Category      │
│  ☑ 🏨 Hotel             │ ← Checked
│  ☐ 🏠 Apartment         │
│  ☐ 🌴 Resort            │
│  ☐ 🏰 Villa             │
│  ☑ 🚪 Guest House       │ ← Checked
│  ☐ 🛏️  Hostel           │
│  ☐ 🌲 Lodge             │
│                         │
│  Price Range            │
│  [Min] ──────── [Max]   │
│                         │
│  Star Rating            │
│  ★★★★★                  │
│                         │
└─────────────────────────┘
```

**Behavior:**
- Multi-select checkboxes
- Real-time URL update
- Instant filtering
- Visual feedback with icons

---

## 5. URL Structure

### Examples:

**All Properties:**
```
/properties
```

**Single Type:**
```
/properties?propertyTypes=["HOTEL"]
```

**Multiple Types:**
```
/properties?propertyTypes=["HOTEL","APARTMENT"]
```

**With Location:**
```
/properties?propertyTypes=["HOTEL"]&city=Addis%20Ababa
```

**With All Filters:**
```
/properties?propertyTypes=["HOTEL","RESORT"]&city=Addis%20Ababa&minPrice=1000&maxPrice=5000&minRating=4
```

---

## 6. Data Flow Diagram

```
┌─────────────────┐
│  User Action    │
│  (Select Hotel) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  URL Updated                    │
│  ?propertyTypes=["HOTEL"]       │
└────────┬────────────────────────┘
         │
         ├──────────────────────────────────┐
         │                                  │
         ▼                                  ▼
┌─────────────────┐              ┌──────────────────┐
│  Header         │              │  Properties Page │
│  Label: "Hotels"│              │  Parse URL       │
└─────────────────┘              └────────┬─────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │  API Request    │
                                 │  with filters   │
                                 └────────┬────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │  Backend        │
                                 │  Filter by type │
                                 └────────┬────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │  Return Results │
                                 └────────┬────────┘
                                          │
                                          ▼
                                 ┌─────────────────────┐
                                 │  Display            │
                                 │  - Heading: "Hotels"│
                                 │  - Count: "45 hotels│
                                 │    found"           │
                                 │  - Hotel cards only │
                                 └─────────────────────┘
```

---

## 7. Responsive Behavior

### Desktop (>1024px):
```
┌────────────────────────────────────────────────────────────┐
│  Header: [Home] [Hotels ▼] [About] [Contact]              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐  ┌──────────────────────────────────────┐   │
│  │ Filters  │  │  Hotels in Addis Ababa               │   │
│  │          │  │  ─────────────────────               │   │
│  │ ☑ Hotel  │  │  23 hotels found in Addis Ababa      │   │
│  │ ☐ Apt    │  │                                      │   │
│  │ ☐ Resort │  │  [Hotel Card 1]                      │   │
│  │          │  │  [Hotel Card 2]                      │   │
│  │          │  │  [Hotel Card 3]                      │   │
│  └──────────┘  └──────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### Mobile (<768px):
```
┌──────────────────────────┐
│  ☰  Logo         [Login] │
├──────────────────────────┤
│                          │
│  Hotels in Addis Ababa   │
│  ─────────────────────   │
│  23 hotels found         │
│                          │
│  [🔍 Filter Button]      │
│                          │
│  [Hotel Card 1]          │
│  [Hotel Card 2]          │
│  [Hotel Card 3]          │
│                          │
└──────────────────────────┘
```

---

## 8. Empty State

### When No Properties Match Filter:
```
┌─────────────────────────────────────────────────────────┐
│  Resorts in Gondar                                      │
│  ──────────────────                                     │
│  0 resorts found in Gondar                              │
│                                                         │
│           🏠                                            │
│                                                         │
│     No properties found                                 │
│                                                         │
│  Try adjusting your filters or check back later.       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Property Type Icons

| Type         | Icon | Label         |
|--------------|------|---------------|
| HOTEL        | 🏨   | Hotels        |
| APARTMENT    | 🏠   | Apartments    |
| RESORT       | 🌴   | Resorts       |
| VILLA        | 🏰   | Villas        |
| GUEST_HOUSE  | 🚪   | Guest Houses  |
| HOSTEL       | 🛏️   | Hostels       |
| LODGE        | 🌲   | Lodges        |

---

## 10. User Journey Example

**Scenario:** User wants to find hotels in Addis Ababa

1. **Homepage:**
   - User sees centered search box
   - Enters "Addis Ababa"
   - Clicks Search

2. **Properties Page:**
   - URL: `/properties?city=Addis%20Ababa`
   - Heading: "Hotels in Addis Ababa"
   - Shows all property types in Addis Ababa

3. **Filter by Type:**
   - User clicks "Properties ▼" in header
   - Selects "Hotels"
   - URL updates: `/properties?city=Addis%20Ababa&propertyTypes=["HOTEL"]`

4. **Results:**
   - Header label changes to "Hotels ▼"
   - Heading: "Hotels in Addis Ababa"
   - Count: "23 hotels found in Addis Ababa"
   - Only hotel cards displayed
   - Dropdown shows "Hotels" as active

5. **Add More Types:**
   - User opens filter sidebar
   - Checks "Apartments"
   - URL: `/properties?city=Addis%20Ababa&propertyTypes=["HOTEL","APARTMENT"]`
   - Heading: "Hotels & Apartments in Addis Ababa"
   - Count: "45 properties found in Addis Ababa"

---

## Summary

The system provides:
- ✅ Intuitive visual feedback
- ✅ Consistent labeling across all components
- ✅ Real-time updates without page reload
- ✅ Clear indication of active filters
- ✅ Responsive design for all screen sizes
- ✅ Accessible and user-friendly interface

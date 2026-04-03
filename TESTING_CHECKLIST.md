# Property Type Filter - Testing Checklist

## Pre-Testing Setup

- [ ] Ensure backend server is running (`npm run dev` in backend directory)
- [ ] Ensure frontend server is running (`npm run dev` in web directory)
- [ ] Database has properties with different property types
- [ ] Clear browser cache and cookies

## 1. Filter Sidebar Tests

### Display Tests
- [ ] Navigate to `/properties` page
- [ ] Verify "Property Category" section appears in filter sidebar
- [ ] Verify all 7 property types are listed:
  - [ ] Hotel (Building2 icon)
  - [ ] Apartment (Home icon)
  - [ ] Resort (Palmtree icon)
  - [ ] Villa (Castle icon)
  - [ ] Guest House (DoorOpen icon)
  - [ ] Hostel (Bed icon)
  - [ ] Lodge (TreePine icon)
- [ ] Verify icons are visible and properly aligned
- [ ] Verify labels are readable and properly formatted

### Interaction Tests
- [ ] Click on "Hotel" checkbox → verify it gets checked
- [ ] Verify URL updates with `propertyTypes=["HOTEL"]`
- [ ] Verify property list updates to show only hotels
- [ ] Click on "Apartment" checkbox (while Hotel is selected)
- [ ] Verify URL updates with `propertyTypes=["HOTEL","APARTMENT"]`
- [ ] Verify property list shows hotels AND apartments
- [ ] Uncheck "Hotel" → verify only apartments remain
- [ ] Uncheck all → verify all properties are shown

### Hover Effects
- [ ] Hover over each property type icon
- [ ] Verify icon color changes from gray to primary color
- [ ] Verify smooth transition animation

### Reset Functionality
- [ ] Select multiple property types
- [ ] Click "Reset" button
- [ ] Verify all property type checkboxes are unchecked
- [ ] Verify URL parameter `propertyTypes` is removed
- [ ] Verify all properties are displayed

## 2. Property Card Tests

### Vertical Card View
- [ ] Navigate to home page (if vertical cards are used there)
- [ ] Verify each property card shows property type badge
- [ ] Verify badge is in top-left corner
- [ ] Verify badge shows correct icon for property type
- [ ] Verify badge shows correct label (e.g., "Hotel", "Villa")
- [ ] Verify badge styling is consistent

### Horizontal Card View
- [ ] Navigate to `/properties` page
- [ ] Verify each property card shows property type badge
- [ ] Verify badge appears next to property name
- [ ] Verify badge shows correct icon for property type
- [ ] Verify badge shows correct label
- [ ] Verify badge doesn't overflow or break layout

### Badge Accuracy
- [ ] For each property type, verify:
  - [ ] HOTEL → Shows Building2 icon + "Hotel"
  - [ ] APARTMENT → Shows Home icon + "Apartment"
  - [ ] RESORT → Shows Palmtree icon + "Resort"
  - [ ] VILLA → Shows Castle icon + "Villa"
  - [ ] GUEST_HOUSE → Shows DoorOpen icon + "Guest House"
  - [ ] HOSTEL → Shows Bed icon + "Hostel"
  - [ ] LODGE → Shows TreePine icon + "Lodge"

## 3. Backend API Tests

### Single Type Filter
- [ ] Test: `GET /api/v1/properties?propertyTypes=["HOTEL"]`
- [ ] Verify response contains only hotels
- [ ] Verify response structure is correct
- [ ] Verify pagination works

### Multiple Types Filter
- [ ] Test: `GET /api/v1/properties?propertyTypes=["HOTEL","VILLA"]`
- [ ] Verify response contains hotels and villas only
- [ ] Verify no other property types are included

### Combined Filters
- [ ] Test: `GET /api/v1/properties?propertyTypes=["HOTEL"]&city=Addis%20Ababa`
- [ ] Verify response contains only hotels in Addis Ababa
- [ ] Test: `GET /api/v1/properties?propertyTypes=["RESORT"]&minPrice=1000&maxPrice=5000`
- [ ] Verify response contains only resorts within price range

### Edge Cases
- [ ] Test: `GET /api/v1/properties?propertyTypes=[]`
- [ ] Verify returns all properties (empty array)
- [ ] Test: `GET /api/v1/properties?propertyTypes=["INVALID_TYPE"]`
- [ ] Verify returns empty results or handles gracefully
- [ ] Test: `GET /api/v1/properties?propertyTypes=invalid-json`
- [ ] Verify error is caught and logged
- [ ] Verify API doesn't crash

## 4. URL Parameter Tests

### Parameter Persistence
- [ ] Select property types
- [ ] Copy URL from address bar
- [ ] Open URL in new tab
- [ ] Verify filters are applied correctly
- [ ] Verify checkboxes are checked

### Browser Navigation
- [ ] Select property types
- [ ] Navigate to property detail page
- [ ] Click browser back button
- [ ] Verify filters are still applied
- [ ] Verify checkboxes are still checked

### URL Manipulation
- [ ] Manually edit URL: `?propertyTypes=["HOTEL"]`
- [ ] Press Enter
- [ ] Verify filter is applied
- [ ] Manually edit URL: `?propertyTypes=malformed`
- [ ] Verify app doesn't crash
- [ ] Verify error is handled gracefully

## 5. Integration Tests

### With Other Filters
- [ ] Apply property type filter + star rating filter
- [ ] Verify both filters work together
- [ ] Apply property type filter + price range filter
- [ ] Verify both filters work together
- [ ] Apply property type filter + facilities filter
- [ ] Verify both filters work together
- [ ] Apply property type filter + location filter
- [ ] Verify both filters work together

### With Sorting
- [ ] Apply property type filter
- [ ] Change sort to "Lowest price first"
- [ ] Verify filtered results are sorted correctly
- [ ] Change sort to "Best reviewed"
- [ ] Verify filtered results are sorted correctly

### With Pagination
- [ ] Apply property type filter
- [ ] Verify pagination controls appear
- [ ] Navigate to page 2
- [ ] Verify filter is still applied
- [ ] Verify URL includes both page and propertyTypes params

### With Search
- [ ] Enter search term in search bar
- [ ] Apply property type filter
- [ ] Verify results match both search and filter
- [ ] Clear search
- [ ] Verify property type filter remains active

## 6. Responsive Design Tests

### Desktop (1920x1080)
- [ ] Verify filter sidebar is visible
- [ ] Verify property type section is fully visible
- [ ] Verify all icons and labels are readable
- [ ] Verify property cards display badges correctly

### Tablet (768x1024)
- [ ] Verify filter sidebar behavior
- [ ] Verify property type section is accessible
- [ ] Verify property cards adapt correctly
- [ ] Verify badges remain visible

### Mobile (375x667)
- [ ] Verify filter sidebar is accessible (drawer/modal)
- [ ] Verify property type section is scrollable
- [ ] Verify checkboxes are tappable
- [ ] Verify property cards stack vertically
- [ ] Verify badges are visible and readable

## 7. Performance Tests

### Load Time
- [ ] Measure page load time without filters
- [ ] Measure page load time with property type filter
- [ ] Verify no significant performance degradation

### Filter Response Time
- [ ] Click property type checkbox
- [ ] Measure time until results update
- [ ] Verify response is under 500ms

### Large Dataset
- [ ] Test with 100+ properties
- [ ] Verify filtering is still fast
- [ ] Verify pagination works correctly
- [ ] Verify no UI lag or freezing

## 8. Accessibility Tests

### Keyboard Navigation
- [ ] Tab through filter sidebar
- [ ] Verify property type checkboxes are focusable
- [ ] Press Space to toggle checkbox
- [ ] Verify checkbox state changes
- [ ] Verify focus indicator is visible

### Screen Reader
- [ ] Enable screen reader (NVDA/JAWS/VoiceOver)
- [ ] Navigate to property type section
- [ ] Verify section heading is announced
- [ ] Verify each checkbox label is announced
- [ ] Verify checkbox state is announced

### Color Contrast
- [ ] Verify icon colors meet WCAG AA standards
- [ ] Verify label text is readable
- [ ] Verify badge text has sufficient contrast

## 9. Error Handling Tests

### Network Errors
- [ ] Disconnect network
- [ ] Try to apply property type filter
- [ ] Verify error message is shown
- [ ] Reconnect network
- [ ] Verify filter works again

### API Errors
- [ ] Simulate 500 error from backend
- [ ] Verify error is handled gracefully
- [ ] Verify user sees friendly error message

### Invalid Data
- [ ] Simulate property with null/undefined type
- [ ] Verify app doesn't crash
- [ ] Verify default icon/label is shown

## 10. Cross-Browser Tests

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Bug Reporting Template

If you find a bug, report it with:

```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Environment**:
- Browser: 
- OS: 
- Screen Size: 

**Screenshots**:
[Attach if applicable]

**Console Errors**:
[Paste any errors from browser console]
```

## Success Criteria

All tests must pass before considering the feature complete:
- ✅ All filter functionality works correctly
- ✅ All property cards display badges correctly
- ✅ Backend API filters properties correctly
- ✅ URL parameters work correctly
- ✅ Integration with other filters works
- ✅ Responsive design works on all screen sizes
- ✅ Accessibility requirements are met
- ✅ Performance is acceptable
- ✅ No console errors or warnings
- ✅ Works across all major browsers

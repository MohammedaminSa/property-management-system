# Testing Instructions - Property Type Filtering System

## Prerequisites

1. Ensure the backend server is running
2. Ensure the web frontend is running
3. Have at least one property of each type in the database

## Test Suite

### Test 1: Hero Section Centering ✅

**Objective:** Verify the search box is centered and not floating

**Steps:**
1. Navigate to the homepage (`/`)
2. Observe the search box in the hero section

**Expected Results:**
- ✅ Search box is horizontally centered
- ✅ No left-right floating animation
- ✅ Search box remains static
- ✅ Responsive on mobile (centered with padding)

**Pass Criteria:**
- Search box is visually centered
- No animation movement

---

### Test 2: Header Navigation - Default State ✅

**Objective:** Verify the default navigation label

**Steps:**
1. Navigate to the homepage (`/`)
2. Look at the header navigation

**Expected Results:**
- ✅ Navigation shows "Properties" with dropdown arrow
- ✅ Clicking opens dropdown with all property types
- ✅ "All Properties" is not highlighted (no active selection)

**Pass Criteria:**
- Label reads "Properties"
- Dropdown is functional

---

### Test 3: Header Navigation - Single Type Selection ✅

**Objective:** Verify dynamic label changes when a type is selected

**Steps:**
1. Click "Properties ▼" in the header
2. Select "Hotels" from the dropdown
3. Observe the navigation label

**Expected Results:**
- ✅ URL changes to `/properties?propertyTypes=["HOTEL"]`
- ✅ Navigation label changes to "Hotels ▼"
- ✅ Dropdown shows "Hotels" as active (highlighted)
- ✅ Page displays only hotels

**Pass Criteria:**
- Label changes from "Properties" to "Hotels"
- Active selection is highlighted in dropdown

**Repeat for each type:**
- Apartments → "Apartments"
- Resorts → "Resorts"
- Villas → "Villas"
- Guest Houses → "Guest Houses"
- Hostels → "Hostels"
- Lodges → "Lodges"

---

### Test 4: Dynamic Heading - No Filter ✅

**Objective:** Verify heading when no property type is selected

**Steps:**
1. Navigate to `/properties`
2. Observe the page heading

**Expected Results:**
- ✅ Heading reads "All Properties"
- ✅ Count text reads "X properties found"

**Pass Criteria:**
- Heading is "All Properties"
- Count uses "properties" (plural)

---

### Test 5: Dynamic Heading - Single Type ✅

**Objective:** Verify heading changes for single type selection

**Steps:**
1. Navigate to `/properties?propertyTypes=["HOTEL"]`
2. Observe the page heading

**Expected Results:**
- ✅ Heading reads "Hotels"
- ✅ Count text reads "X hotels found"
- ✅ Only hotel properties are displayed

**Pass Criteria:**
- Heading matches the selected type
- Count text uses the correct plural form

**Test each type:**
- HOTEL → "Hotels" / "X hotels found"
- APARTMENT → "Apartments" / "X apartments found"
- RESORT → "Resorts" / "X resorts found"
- VILLA → "Villas" / "X villas found"
- GUEST_HOUSE → "Guest Houses" / "X guest houses found"
- HOSTEL → "Hostels" / "X hostels found"
- LODGE → "Lodges" / "X lodges found"

---

### Test 6: Dynamic Heading - Two Types ✅

**Objective:** Verify heading for two selected types

**Steps:**
1. Navigate to `/properties?propertyTypes=["HOTEL","APARTMENT"]`
2. Observe the page heading

**Expected Results:**
- ✅ Heading reads "Hotels & Apartments"
- ✅ Count text reads "X properties found"
- ✅ Both hotels and apartments are displayed

**Pass Criteria:**
- Heading shows "Type1 & Type2" format
- Count uses "properties" (generic)

---

### Test 7: Dynamic Heading - Multiple Types ✅

**Objective:** Verify heading for three or more types

**Steps:**
1. Navigate to `/properties?propertyTypes=["HOTEL","APARTMENT","RESORT"]`
2. Observe the page heading

**Expected Results:**
- ✅ Heading reads "Multiple Property Types"
- ✅ Count text reads "X properties found"
- ✅ All three types are displayed

**Pass Criteria:**
- Heading is "Multiple Property Types"
- All selected types are shown

---

### Test 8: Dynamic Heading with Location ✅

**Objective:** Verify heading includes location when specified

**Steps:**
1. Navigate to `/properties?propertyTypes=["HOTEL"]&city=Addis%20Ababa`
2. Observe the page heading

**Expected Results:**
- ✅ Heading reads "Hotels in Addis Ababa"
- ✅ Count text reads "X hotels found in Addis Ababa"
- ✅ Only hotels in Addis Ababa are displayed

**Pass Criteria:**
- Heading includes location
- Count text includes location

**Test variations:**
- No type + location → "Hotels in [City]" (default)
- Single type + location → "[Type] in [City]"
- Multiple types + location → "Multiple Property Types in [City]"

---

### Test 9: Filter Sidebar Integration ✅

**Objective:** Verify sidebar checkboxes work correctly

**Steps:**
1. Navigate to `/properties`
2. Open the filter sidebar (desktop) or filter modal (mobile)
3. Check "Hotel" checkbox
4. Observe URL and results

**Expected Results:**
- ✅ URL updates to include `propertyTypes=["HOTEL"]`
- ✅ Heading changes to "Hotels"
- ✅ Only hotels are displayed
- ✅ Header navigation label changes to "Hotels"

**Pass Criteria:**
- Checkbox selection triggers filtering
- All UI elements update accordingly

**Test multi-select:**
1. Check "Hotel"
2. Check "Apartment"
3. Verify URL: `propertyTypes=["HOTEL","APARTMENT"]`
4. Verify heading: "Hotels & Apartments"
5. Verify both types are displayed

---

### Test 10: Clear Filters ✅

**Objective:** Verify clearing filters returns to default state

**Steps:**
1. Navigate to `/properties?propertyTypes=["HOTEL"]`
2. Click "Reset" or "Clear Filters" button
3. Observe the results

**Expected Results:**
- ✅ URL changes to `/properties`
- ✅ Heading changes to "All Properties"
- ✅ Navigation label changes to "Properties"
- ✅ All property types are displayed

**Pass Criteria:**
- All filters are cleared
- UI returns to default state

---

### Test 11: Direct URL Navigation ✅

**Objective:** Verify system works with direct URL entry

**Steps:**
1. Manually enter URL: `/properties?propertyTypes=["VILLA"]`
2. Press Enter
3. Observe the page

**Expected Results:**
- ✅ Page loads correctly
- ✅ Heading reads "Villas"
- ✅ Navigation label reads "Villas"
- ✅ Only villas are displayed
- ✅ Dropdown shows "Villas" as active

**Pass Criteria:**
- System correctly parses URL parameters
- All UI elements reflect the filter

---

### Test 12: Invalid URL Parameters ✅

**Objective:** Verify system handles invalid parameters gracefully

**Steps:**
1. Navigate to `/properties?propertyTypes=invalid`
2. Observe the page

**Expected Results:**
- ✅ Page loads without errors
- ✅ Heading reads "All Properties" (fallback)
- ✅ All properties are displayed
- ✅ No console errors

**Pass Criteria:**
- System handles invalid JSON gracefully
- Falls back to default state

**Test other invalid cases:**
- Empty array: `propertyTypes=[]` → Shows all properties
- Invalid type: `propertyTypes=["INVALID"]` → Shows all properties
- Malformed JSON: `propertyTypes=[HOTEL` → Shows all properties

---

### Test 13: Backend Filtering ✅

**Objective:** Verify backend correctly filters by property type

**Steps:**
1. Open browser DevTools Network tab
2. Navigate to `/properties?propertyTypes=["HOTEL"]`
3. Observe the API request

**Expected Results:**
- ✅ API request includes `propertyTypes=["HOTEL"]` parameter
- ✅ Response contains only hotels
- ✅ Response count matches displayed count

**Pass Criteria:**
- Backend receives correct parameter
- Backend returns filtered results

**Test with multiple types:**
1. Navigate to `/properties?propertyTypes=["HOTEL","APARTMENT"]`
2. Verify API request includes both types
3. Verify response contains both types

---

### Test 14: Empty Results ✅

**Objective:** Verify empty state when no properties match filter

**Steps:**
1. Navigate to a filter combination with no results
   - Example: `/properties?propertyTypes=["RESORT"]&city=NonExistentCity`
2. Observe the page

**Expected Results:**
- ✅ Heading reads "Resorts in NonExistentCity"
- ✅ Count text reads "0 resorts found in NonExistentCity"
- ✅ Empty state message is displayed
- ✅ Suggestion to adjust filters is shown

**Pass Criteria:**
- Empty state is user-friendly
- Heading and count still reflect the filter

---

### Test 15: Mobile Responsiveness ✅

**Objective:** Verify system works on mobile devices

**Steps:**
1. Open browser DevTools
2. Switch to mobile view (iPhone/Android)
3. Navigate to `/properties?propertyTypes=["HOTEL"]`
4. Test all interactions

**Expected Results:**
- ✅ Hero search box is centered and responsive
- ✅ Header navigation works (hamburger menu)
- ✅ Heading is readable and properly sized
- ✅ Filter button opens modal
- ✅ Property type selection works in modal

**Pass Criteria:**
- All features work on mobile
- UI is responsive and usable

---

### Test 16: Browser Back/Forward ✅

**Objective:** Verify browser navigation works correctly

**Steps:**
1. Navigate to `/properties`
2. Select "Hotels" (URL: `/properties?propertyTypes=["HOTEL"]`)
3. Select "Apartments" (URL: `/properties?propertyTypes=["APARTMENT"]`)
4. Click browser back button
5. Click browser forward button

**Expected Results:**
- ✅ Back button returns to Hotels view
- ✅ Forward button returns to Apartments view
- ✅ Heading updates correctly
- ✅ Navigation label updates correctly
- ✅ Results update correctly

**Pass Criteria:**
- Browser history works as expected
- UI updates on navigation

---

### Test 17: Dropdown Active State ✅

**Objective:** Verify dropdown shows active selection

**Steps:**
1. Navigate to `/properties?propertyTypes=["HOTEL"]`
2. Click "Hotels ▼" in header
3. Observe the dropdown

**Expected Results:**
- ✅ "Hotels" option is highlighted
- ✅ Highlight uses primary color background
- ✅ Other options are not highlighted

**Pass Criteria:**
- Active selection is visually distinct
- Only one option is highlighted

---

### Test 18: Admin Property Creation ✅

**Objective:** Verify property type can be set in admin

**Steps:**
1. Login to admin panel
2. Navigate to Create Property page
3. Fill in property details
4. Select "Hotel" from Property Type dropdown
5. Submit form
6. Navigate to properties page
7. Filter by "Hotels"

**Expected Results:**
- ✅ Property type dropdown shows all 7 types
- ✅ Property is created with type "HOTEL"
- ✅ Property appears when filtering by "Hotels"

**Pass Criteria:**
- Property type is saved correctly
- Property is filterable by type

---

### Test 19: Performance ✅

**Objective:** Verify system performs well with many properties

**Steps:**
1. Ensure database has 100+ properties
2. Navigate to `/properties`
3. Select a property type
4. Measure page load time

**Expected Results:**
- ✅ Page loads in < 2 seconds
- ✅ Filtering is instant (< 500ms)
- ✅ No lag when switching types
- ✅ Smooth scrolling

**Pass Criteria:**
- Performance is acceptable
- No noticeable delays

---

### Test 20: Accessibility ✅

**Objective:** Verify system is accessible

**Steps:**
1. Use keyboard navigation only
2. Tab through header navigation
3. Open dropdown with Enter/Space
4. Select type with arrow keys and Enter
5. Use screen reader (optional)

**Expected Results:**
- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators are visible
- ✅ Dropdown can be navigated with keyboard
- ✅ Screen reader announces changes (if tested)

**Pass Criteria:**
- System is fully keyboard accessible
- Focus management is correct

---

## Automated Testing (Optional)

### Unit Tests

```typescript
// Test: Parse property types from URL
describe('parsePropertyTypes', () => {
  it('should parse single type', () => {
    const url = '?propertyTypes=["HOTEL"]';
    const result = parsePropertyTypes(url);
    expect(result).toEqual(['HOTEL']);
  });

  it('should parse multiple types', () => {
    const url = '?propertyTypes=["HOTEL","APARTMENT"]';
    const result = parsePropertyTypes(url);
    expect(result).toEqual(['HOTEL', 'APARTMENT']);
  });

  it('should handle invalid JSON', () => {
    const url = '?propertyTypes=invalid';
    const result = parsePropertyTypes(url);
    expect(result).toEqual([]);
  });
});

// Test: Generate dynamic heading
describe('generateHeading', () => {
  it('should return "All Properties" for no filter', () => {
    const heading = generateHeading([], '');
    expect(heading).toBe('All Properties');
  });

  it('should return "Hotels" for single type', () => {
    const heading = generateHeading(['HOTEL'], '');
    expect(heading).toBe('Hotels');
  });

  it('should include location', () => {
    const heading = generateHeading(['HOTEL'], 'Addis Ababa');
    expect(heading).toBe('Hotels in Addis Ababa');
  });
});
```

### Integration Tests

```typescript
// Test: End-to-end filtering
describe('Property Type Filtering', () => {
  it('should filter properties by type', async () => {
    // Navigate to properties page
    await page.goto('/properties');
    
    // Click Properties dropdown
    await page.click('[data-testid="properties-dropdown"]');
    
    // Select Hotels
    await page.click('[data-testid="type-hotel"]');
    
    // Verify URL
    expect(page.url()).toContain('propertyTypes=["HOTEL"]');
    
    // Verify heading
    const heading = await page.textContent('h2');
    expect(heading).toBe('Hotels');
    
    // Verify only hotels are displayed
    const cards = await page.$$('[data-testid="property-card"]');
    for (const card of cards) {
      const type = await card.getAttribute('data-type');
      expect(type).toBe('HOTEL');
    }
  });
});
```

---

## Bug Report Template

If you find any issues, please report using this template:

```markdown
### Bug Report

**Test Case:** [Test number and name]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[If applicable]

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- Version: [Browser version]
- Device: [Desktop/Mobile]
- Screen Size: [1920x1080/375x667]

**Console Errors:**
[Any errors in browser console]

**Additional Notes:**
[Any other relevant information]
```

---

## Test Results Summary

After completing all tests, fill out this summary:

```markdown
## Test Results

| Test # | Test Name                          | Status | Notes |
|--------|------------------------------------|--------|-------|
| 1      | Hero Section Centering             | ✅/❌   |       |
| 2      | Header Navigation - Default        | ✅/❌   |       |
| 3      | Header Navigation - Single Type    | ✅/❌   |       |
| 4      | Dynamic Heading - No Filter        | ✅/❌   |       |
| 5      | Dynamic Heading - Single Type      | ✅/❌   |       |
| 6      | Dynamic Heading - Two Types        | ✅/❌   |       |
| 7      | Dynamic Heading - Multiple Types   | ✅/❌   |       |
| 8      | Dynamic Heading with Location      | ✅/❌   |       |
| 9      | Filter Sidebar Integration         | ✅/❌   |       |
| 10     | Clear Filters                      | ✅/❌   |       |
| 11     | Direct URL Navigation              | ✅/❌   |       |
| 12     | Invalid URL Parameters             | ✅/❌   |       |
| 13     | Backend Filtering                  | ✅/❌   |       |
| 14     | Empty Results                      | ✅/❌   |       |
| 15     | Mobile Responsiveness              | ✅/❌   |       |
| 16     | Browser Back/Forward               | ✅/❌   |       |
| 17     | Dropdown Active State              | ✅/❌   |       |
| 18     | Admin Property Creation            | ✅/❌   |       |
| 19     | Performance                        | ✅/❌   |       |
| 20     | Accessibility                      | ✅/❌   |       |

**Overall Status:** [PASS/FAIL]

**Pass Rate:** [X/20 tests passed]

**Critical Issues:** [List any critical issues found]

**Minor Issues:** [List any minor issues found]

**Recommendations:** [Any recommendations for improvement]
```

---

## Quick Smoke Test

For a quick verification, run these essential tests:

1. ✅ Navigate to homepage - search box is centered
2. ✅ Click "Properties" → Select "Hotels"
3. ✅ Verify URL: `?propertyTypes=["HOTEL"]`
4. ✅ Verify heading: "Hotels"
5. ✅ Verify nav label: "Hotels"
6. ✅ Verify only hotels are shown
7. ✅ Click "All Properties" in dropdown
8. ✅ Verify everything resets

**If all 8 steps pass, the core functionality is working correctly.**

---

## Conclusion

This comprehensive test suite ensures the property type filtering system works correctly across all scenarios. Complete all tests before deploying to production.

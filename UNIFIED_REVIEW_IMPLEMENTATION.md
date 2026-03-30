# Unified Review Creation - Updated Implementation

## Overview
The unified review creation system has been updated to support both **creating new** and **selecting existing** restaurants and dishes. This provides users with flexibility while maintaining data integrity.

## Changes Summary

### 1. Updated Service Interface (`unified.client.ts`)

**New Payload Structure:**
```typescript
export interface IUnifiedCreatePayload {
  restaurantId?: string;           // For selecting existing restaurant
  restaurant?: {
    data?: {
      name: string;
      description?: string;
      address: string;
      city: string;
      state: string;
      road: string;
      location: {
        lat: number | string;
        lng: number | string;
      };
      contact?: string;
      tags?: string[];
    };
    images?: string[];
  };
  dishId?: string;                 // For selecting existing dish
  dish?: {
    data?: {
      name: string;
      description?: string;
      price?: number;
      ingredients: string[];
      tags?: string[];
      image?: string;
    };
    images?: string[];
  };
  review: {
    data: {
      rating: number;
      comment?: string;
      tags?: string[];
    };
    images?: string[];
    image?: string | string[];
  };
}
```

**Key Features:**
- Either `restaurantId` (for selecting) OR `restaurant.data` (for creating) - enforced by backend validation
- Either `dishId` (for selecting) OR `dish.data` (for creating) - enforced by backend validation
- Review is always required
- Images are optional and handled via FormData

---

### 2. Enhanced Dialog Component (`UnifiedCreateReviewDialog.tsx`)

#### New Features

**Mode Selection**
- Users can toggle between "Create New" and "Select Existing" for both restaurant and dish
- Each has its own independent mode selection

**Dynamic Form Rendering**
- Forms only appear when "Create New" is selected
- Selection dropdowns only appear when "Select Existing" is selected
- Loading states and empty states for both options

**Data Fetching**
- Restaurants are fetched lazily when dialog opens and mode is set to "select"
- Dishes are fetched lazily when dialog opens and mode is set to "select"
- Uses React Query for efficient data management

**Validation**
- Conditional validation based on selected mode
- All required fields are validated before submission
- User-friendly error messages

#### Component Structure

```typescript
type RestaurantMode = "create" | "select";
type DishMode = "create" | "select";

// State Management
const [restaurantMode, setRestaurantMode] = useState<RestaurantMode>("create");
const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
const [dishMode, setDishMode] = useState<DishMode>("create");
const [selectedDishId, setSelectedDishId] = useState<string>("");

// Data Fetching
const { data: restaurantsResponse, isLoading: restaurantsLoading } = useQuery({
  queryKey: ["restaurants-for-review"],
  queryFn: () => getRestaurants("limit=50&sortBy=createdAt&sortOrder=desc"),
  enabled: open && restaurantMode === "select",
});

const { data: dishesResponse, isLoading: dishesLoading } = useQuery({
  queryKey: ["dishes-for-review"],
  queryFn: () => getDishes("limit=50&sortBy=createdAt&sortOrder=desc"),
  enabled: open && dishMode === "select",
});
```

#### Payload Building Logic

```typescript
// Validate restaurant
let restaurantPayload: { restaurantId?: string; restaurant?: any } = {};
if (restaurantMode === "select") {
  if (!selectedRestaurantId) {
    throw new Error("Please select a restaurant");
  }
  restaurantPayload.restaurantId = selectedRestaurantId;
} else {
  // Build restaurant data from form
  restaurantPayload.restaurant = {
    data: {
      name: restaurantName,
      // ... other fields
    },
  };
}

// Similar logic for dish...
const payload: IUnifiedCreatePayload = {
  ...restaurantPayload,
  ...dishPayload,
  review: { /* review data */ },
};
```

---

## UI Flow

### 1. Restaurant Section
```
┌─ Mode Selection ────────────────────┐
│ ○ Create New Restaurant             │
│ ○ Select Existing Restaurant        │
└─────────────────────────────────────┘
      │
      ├─→ Create Mode: Show form fields
      │   - Name, Contact, Description
      │   - Address, Road, City, State
      │   - Latitude, Longitude, Tags
      │   - Image Upload (max 10)
      │
      └─→ Select Mode: Show dropdown
          - Fetches 50 restaurants
          - Shows "Name (City)"
          - Loading/empty states
```

### 2. Dish Section
```
┌─ Mode Selection ────────────────────┐
│ ○ Create New Dish                   │
│ ○ Select Existing Dish              │
└─────────────────────────────────────┘
      │
      ├─→ Create Mode: Show form fields
      │   - Name, Price, Description
      │   - Ingredients (required)
      │   - Tags
      │   - Image Upload (max 5)
      │
      └─→ Select Mode: Show dropdown
          - Fetches 50 dishes
          - Shows "Name (Restaurant)"
          - Loading/empty states
```

### 3. Review Section (Always Required)
```
┌─ Review Information ────────────────┐
│ Rating: [1★ | 2★ | 3★ | 4★ | 5★]  │
│ Tags: comma, separated              │
│ Comment: [Textarea]                 │
│ Images: [Drop zone - max 5]         │
└─────────────────────────────────────┘
```

---

## Backend API Integration

**Endpoint**: `POST /unified/create-all`

**Validation Rules** (enforced by backend):
```typescript
const createUnifiedSchema = z.object({
  restaurantId: z.string().optional(),
  restaurant: z.object({ /* ... */ }).optional(),
  dishId: z.string().optional(),
  dish: z.object({ /* ... */ }).optional(),
  review: z.object({ /* ... */ }),
})
  .refine(
    (data) => data.restaurantId || (data.restaurant?.data),
    { message: "Either restaurantId or restaurant.data is required", path: ["restaurant"] }
  )
  .refine(
    (data) => data.dishId || (data.dish?.data),
    { message: "Either dishId or dish.data is required", path: ["dish"] }
  );
```

---

## Error Handling

**Client-side Validation:**
- Form field validation before submission
- Mode-specific validation
- User-friendly error messages via toast notifications

**Server-side Validation:**
- Zod schema validation
- Business logic validation
- Transaction integrity checks

**Error Messages Examples:**
```
- "Please select a restaurant"
- "Restaurant name is required"
- "At least one dish ingredient is required"
- "Rating must be an integer between 1 and 5"
- "Dish price must be greater than 0"
```

---

## Performance Optimizations

1. **Lazy Data Fetching**
   - Restaurants only fetched when opening dialog and selecting that mode
   - Dishes only fetched when opening dialog and selecting that mode
   - Reduces unnecessary network requests

2. **Query Keys**
   - Proper React Query cache invalidation
   - Prevents duplicate requests

3. **Image Handling**
   - Efficient file de-duplication in `appendFiles()`
   - URL object lifecycle management
   - Memory cleanup on unmount

---

## User Experience Improvements

1. **Clear Mode Selection**
   - Toggle between create/select options
   - No hidden complexity
   - Immediate feedback on availability

2. **Loading States**
   - Spinner shown while fetching data
   - Users know something is loading

3. **Empty States**
   - Clear message when no items available
   - Suggests creating new if needed

4. **Consistent Styling**
   - Follows existing design system
   - Responsive layout (mobile & desktop)
   - Accessible UI components

5. **Reset on Close**
   - Form state reset
   - Mode reset to "create"
   - Selections cleared
   - Images cleared

---

## Testing Scenarios

### Happy Paths
- ✅ Create new restaurant + Create new dish + Review
- ✅ Select existing restaurant + Create new dish + Review
- ✅ Create new restaurant + Select existing dish + Review
- ✅ Select existing restaurant + Select existing dish + Review

### Error Cases
- ✅ Missing required fields in create mode
- ✅ No selection in select mode
- ✅ Invalid rating value
- ✅ Negative price
- ✅ Missing ingredients
- ✅ Invalid lat/lng

### Edge Cases
- ✅ Empty restaurant/dish lists
- ✅ Single item in lists
- ✅ Large file uploads (within limits)
- ✅ Form submission with pending state

---

## Files Modified

1. **`services/unified.client.ts`**
   - Updated `IUnifiedCreatePayload` interface
   - Updated `createUnifiedReviewTransaction` function

2. **`components/modules/review/UnifiedCreateReviewDialog.tsx`**
   - Complete refactor with mode selection
   - New state management
   - Lazy data fetching
   - Conditional rendering
   - Enhanced validation

---

## Future Enhancements

1. **Search in Selects**
   - Add search functionality for large lists
   - Client-side filtering

2. **Favorites/Recent**
   - Show recently used restaurants/dishes
   - Allow favoriting

3. **Quick Select**
   - Pre-populate from user's current context
   - Smart defaults

4. **Analytics**
   - Track user choices (create vs select)
   - Measure completion rates

5. **Batch Operations**
   - Create multiple reviews at once
   - Bulk import features

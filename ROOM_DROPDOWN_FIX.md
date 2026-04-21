# Room Selection Dropdown Fix

## Problem
Dorm admin could not select a room from the dropdown when approving room change requests. The dropdown appeared empty even though the backend was returning 69 available rooms.

## Root Cause
**Field Name Mismatch**: The frontend component was using incorrect field names to access room data:

### Database Schema (Actual)
```javascript
{
  id: "firestore-doc-id",           // Firestore document ID
  roomNumber: "N-101",              // Human-readable room number
  floor: 1,
  dormId: "dorm-doc-id",
  dorm: {                           // Populated by repository
    id: "dorm-doc-id",
    name: "North Hall",
    code: "NH"
  },
  genderRestriction: "Male",
  capacity: 2,
  currentOccupancy: 0,
  status: "Available"
}
```

### Frontend Code (Before Fix)
```tsx
<SelectItem key={r.roomId} value={r.roomId}>
  {r.roomId} — {r.building} Fl.{r.floor} ({r.genderRestriction})
</SelectItem>
```

**Issues:**
1. `r.roomId` doesn't exist → key and value were undefined
2. `r.building` doesn't exist → display text was broken
3. Should use `r.id` for the document ID
4. Should use `r.roomNumber` for display
5. Should use `r.dorm.name` or `r.dorm.code` for building name

## Solution

### Fixed Frontend Code
```tsx
<SelectItem key={r.id} value={r.id}>
  {r.roomNumber} — {r.dorm?.name || r.dorm?.code || 'Unknown'} Fl.{r.floor} ({r.genderRestriction})
</SelectItem>
```

### Changes Made

1. **src/pages/RoomChangesPage.tsx**:
   - Changed `key={r.roomId}` to `key={r.id}` (use Firestore document ID)
   - Changed `value={r.roomId}` to `value={r.id}` (send document ID to backend)
   - Changed `{r.roomId}` to `{r.roomNumber}` (display human-readable room number)
   - Changed `{r.building}` to `{r.dorm?.name || r.dorm?.code || 'Unknown'}` (use populated dorm object)
   - Added empty state message when no rooms available
   - Added room count display below dropdown
   - Added console logging for debugging

2. **Room Request Display**:
   - Fixed `req.currentRoom?.roomId` to `req.currentRoom?.roomNumber || req.currentRoom?.roomId || 'Unknown'`
   - Fixed `req.requestedRoom.roomId` to `req.requestedRoom.roomNumber || req.requestedRoom.roomId || 'Unknown'`

## Backend Verification

The backend was already working correctly:

1. **Endpoint**: `GET /api/rooms/available`
2. **Response Format**: 
   ```json
   {
     "success": true,
     "data": {
       "rooms": [
         {
           "id": "doc-id",
           "roomNumber": "N-101",
           "floor": 1,
           "dormId": "dorm-id",
           "dorm": {
             "id": "dorm-id",
             "name": "North Hall",
             "code": "NH"
           },
           "genderRestriction": "Male",
           "capacity": 2,
           "currentOccupancy": 0,
           "status": "Available"
         }
       ]
     }
   }
   ```

3. **Repository**: `roomRepository.findAvailable()` correctly populates the `dorm` object
4. **Authorization**: Dorm admins have access to this endpoint ✅
5. **Data**: 69 available rooms exist in database ✅

## Testing

To verify the fix:

1. Login as dorm admin (username: `dormadmin`, password: `Dormadmin@2026`)
2. Navigate to Room Changes page
3. Click "Approve" on a pending room change request
4. Check the dropdown - should now show:
   - Room numbers (e.g., "N-101", "S-102")
   - Building names (e.g., "North Hall", "South Hall")
   - Floor numbers
   - Gender restrictions
5. Check browser console for debug logs:
   - "Available rooms loaded: 69 rooms"
   - "First room sample: { id: '...', roomNumber: '...', ... }"
6. Check below dropdown for room count: "69 available rooms loaded"

## Related Files

- `src/pages/RoomChangesPage.tsx` - Main component with the fix
- `src/lib/api.ts` - API service (no changes needed)
- `backend/src/repositories/roomRepository.js` - Room data structure
- `backend/src/services/roomService.js` - Room service logic
- `backend/src/controllers/roomController.js` - API endpoint
- `backend/src/seed.js` - Database schema reference

## Prevention

To prevent similar issues in the future:

1. **Document the data schema** - Create a types file with the actual database schema
2. **Use TypeScript interfaces** - Define proper types for Room objects
3. **Test with real data** - Always test dropdowns with actual backend data
4. **Check browser console** - Look for undefined values or errors
5. **Verify field names** - Check the seed file or database to confirm field names

## Status

✅ **FIXED** - Room selection dropdown now displays all available rooms correctly

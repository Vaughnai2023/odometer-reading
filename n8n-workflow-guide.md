# n8n Workflow Setup Guide

## Overview
This guide will help you set up an n8n workflow to receive data from your MileageLog app and store it in Google Drive (photos) and Google Sheets (metadata).

## What Your App Sends

Your app sends a JSON payload like this:

```json
{
  "id": 1733485200000,
  "date": "2024-12-06",
  "startKm": 110.5,
  "endKm": 150.3,
  "distance": 39.8,
  "notes": "Client visit to Cape Town",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "timestamp": "2024-12-06T10:30:00.000Z"
}
```

**Photo Format:** The photo is already base64 encoded with the data URI prefix `data:image/jpeg;base64,`

## n8n Workflow Structure

### Step 1: Webhook Trigger
1. Add a **Webhook** node
2. Set **HTTP Method** to `POST`
3. Set **Path** to something like `mileage-tracker`
4. Set **Response Code** to `200`
5. Enable **Respond Immediately**
6. Copy the webhook URL (you'll add this to the app settings)

### Step 2: Extract Base64 Photo Data
1. Add a **Code** node after the webhook
2. Use this JavaScript code:

```javascript
// Extract base64 data without the data URI prefix
const photoData = $input.item.json.photo;

if (photoData && photoData.startsWith('data:image')) {
  // Remove "data:image/jpeg;base64," prefix
  const base64Only = photoData.split(',')[1];

  return {
    json: {
      ...items[0].json,
      photoBase64: base64Only,
      photoFileName: `odometer_${items[0].json.date}_${items[0].json.id}.jpg`
    }
  };
} else {
  // No photo provided
  return {
    json: {
      ...items[0].json,
      photoBase64: null,
      photoFileName: null
    }
  };
}
```

### Step 3: Save Photo to Google Drive (Optional - if photo exists)
1. Add an **IF** node to check if photo exists
   - Condition: `{{ $json.photoBase64 }}` is not empty

2. **TRUE branch:** Add **Google Drive** node
   - **Operation:** Upload a File
   - **File Name:** `{{ $json.photoFileName }}`
   - **File Content (Base64):** `{{ $json.photoBase64 }}`
   - **Folder:** Select your destination folder in Google Drive
   - **Convert to Google Docs Format:** No

3. Add a **Code** node after Google Drive to extract the file URL:

```javascript
return {
  json: {
    ...items[0].json,
    photoUrl: items[0].json.webViewLink || items[0].json.webContentLink || ''
  }
};
```

### Step 4: Save Metadata to Google Sheets
1. Add a **Google Sheets** node
2. **Operation:** Append or Update Row
3. **Document ID:** Your Google Sheet ID
4. **Sheet Name:** e.g., "Mileage Log"
5. **Data Mode:** Define Below

**Column Mapping:**
- **Date:** `{{ $json.date }}`
- **Start KM:** `{{ $json.startKm }}`
- **End KM:** `{{ $json.endKm }}`
- **Distance:** `{{ $json.distance }}`
- **Notes:** `{{ $json.notes }}`
- **Photo URL:** `{{ $json.photoUrl }}` (from Google Drive step)
- **Timestamp:** `{{ $json.timestamp }}`
- **ID:** `{{ $json.id }}`

### Step 5: Send Success Response
1. Add a **Respond to Webhook** node at the end
2. **Response Code:** 200
3. **Response Body:**
```json
{
  "success": true,
  "message": "Trip logged successfully",
  "id": "{{ $json.id }}"
}
```

## Google Sheets Setup

Create a new Google Sheet with these columns (in this order):

| Date | Start KM | End KM | Distance | Notes | Photo URL | Timestamp | ID |
|------|----------|--------|----------|-------|-----------|-----------|-----|
|      |          |        |          |       |           |           |     |

**Optional:** Add a header row with formulas:
- **Tax Year:** `=IF(MONTH(A2)>=3, YEAR(A2)&"/"&YEAR(A2)+1, YEAR(A2)-1&"/"&YEAR(A2))`
- **Month:** `=TEXT(A2,"MMMM YYYY")`

## Alternative: Simpler Workflow (No Photo Upload)

If you want to keep photos in the app only and just sync metadata:

1. **Webhook** → Trigger
2. **Google Sheets** → Append row directly
3. Skip the photo base64 extraction and Google Drive upload

Just map the fields directly from the webhook payload.

## Testing Your Workflow

1. In n8n, activate your workflow
2. Copy the webhook URL
3. In MileageLog app:
   - Tap the settings icon (top right)
   - Paste your n8n webhook URL
   - Save settings
4. Log a test trip
5. Check n8n execution log
6. Verify data appears in Google Sheets
7. Verify photo appears in Google Drive (if configured)

## Troubleshooting

### Photo Upload Fails
- **Problem:** "Invalid base64 data"
- **Solution:** Make sure you're stripping the `data:image/jpeg;base64,` prefix in the Code node

### Timeout Errors
- **Problem:** Request times out after 30 seconds
- **Solution:** Enable "Respond Immediately" in the Webhook node, then process data asynchronously

### Large Payload Issues
- **Problem:** Photos too large (>10MB)
- **Solution:** The app already compresses images to 1920px width at 80% quality. If still too large, reduce quality in index.html:1388 from `0.8` to `0.6`

### Duplicate Entries
- **Problem:** Same trip logged multiple times
- **Solution:** Use the `id` field to deduplicate. In Google Sheets node, use "Append or Update Row" with `id` as the key column

## Security Considerations

1. **Webhook URL:** Keep your n8n webhook URL private
2. **Authentication (Optional):** Add a secret token to webhook headers for extra security
3. **Data Privacy:** Photos contain personal vehicle information - ensure Google Drive folder permissions are set correctly

## Next Steps

Once your n8n workflow is working:
1. Set up automatic tax year summaries
2. Create monthly reports
3. Add email notifications when trips are logged
4. Build a dashboard using Google Data Studio

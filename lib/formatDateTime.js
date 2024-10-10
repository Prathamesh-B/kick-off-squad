export function formatDateTime(dateTime, forInput = false) {
    const date = new Date(dateTime);
    
    if (forInput) {
        // Adjust the date to local time and return it in the required format (YYYY-MM-DDTHH:MM)
        const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localISOTime = new Date(date.getTime() - tzOffset)
            .toISOString()
            .slice(0, 16); // "YYYY-MM-DDTHH:MM" for datetime-local input
        return localISOTime;
    }

    return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

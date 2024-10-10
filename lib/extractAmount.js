export function extractAmount(description) {
    if (!description) return null;
    
    // Look for patterns like "₹500" or "Rs 500" or "500/-"
    const matches = description.match(/(?:₹|Rs\.?\s?)\s*(\d+)|-?\s*(\d+)\s*\/-/i);
    
    if (matches) {
        return parseInt(matches[1] || matches[2]);
    }
    
    return null;
}

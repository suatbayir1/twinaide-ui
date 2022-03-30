// DT
export const queryableDTsFields = ["privacy", "name", "description", "displayName", "type"];
export const sortTypes = [
    { key: "name-a-to-z", label: "Name (A → Z)" },
    { key: "name-z-to-a", label: "Name (Z → A)" },
    { key: "modified-oldest", label: "Modified (Oldest)" },
    { key: "modified-newest", label: "Modified (Newest)" },
];
export const privacyTypes = [
    { key: "all", label: "All Digital Twins" },
    { key: "public", label: "Public Digital Twins" },
    { key: "private", label: "Private Digital Twins" },
];
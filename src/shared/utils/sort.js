export const sortDTs = (dts, type) => {
    switch (type.key) {
        case "name-a-to-z":
            dts.sort(function (a, b) {
                return a.displayName.localeCompare(b.displayName);
            });
            return dts;
        case "name-z-to-a":
            dts.sort(function (a, b) {
                return b.displayName.localeCompare(a.displayName);
            });
            return dts;
        case "modified-oldest":
            dts.sort(function (a, b) {
                return new Date(a.updatedAt) - new Date(b.updatedAt);
            });
            return dts;
        case "modified-newest":
            dts.sort(function (a, b) {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
            return dts;
        default:
            return dts;
    }
}
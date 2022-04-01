export const getDTOwnerAccess = (ownerID, userID) => {
    if (ownerID !== userID) {
        return false;
    }
    return true;
}
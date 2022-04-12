// Constants
import { queryableDTsFields } from "../constants/constants";

// Helpers
import { getDTOwnerAccess } from "../auth/access";

export const filterDTsBySearchTerm = (dts, term) => {
    try {
        if (term.trim() === "") {
            return dts;
        }

        let splittedTerm = term.split(":");
        if (splittedTerm[1] === undefined) {
            splittedTerm[1] = "";
        }

        let filteredDTs = [];

        if (queryableDTsFields.includes(splittedTerm[0])) {
            filteredDTs = dts.filter(dt => dt[splittedTerm[0]].toLowerCase().includes(splittedTerm[1].toLowerCase()));

            return filteredDTs;
        }

        filteredDTs = [];
        dts.forEach(dt => {
            let foundDT = false;
            Object.keys(dt).forEach(key => {
                if (foundDT)
                    return;

                if (typeof dt[key] === "string" && dt[key].toLowerCase().includes(term.toLowerCase())) {
                    foundDT = true;
                    filteredDTs.push(dt);
                }
            })
        })

        return filteredDTs;
    } catch (e) {
        return dts;
    }
}

export const filterDTsByPrivacy = (dts, privacy, user) => {
    switch (privacy.key) {
        case "all":
            return dts;
        case "my-dts":
            return dts.filter(dt => getDTOwnerAccess(dt.owner._id, user.id) === true);
        case "public":
            return dts.filter(dt => dt.privacy === "public");
        case "private":
            return dts.filter(dt => dt.privacy === "private");
        default:
            return dts;
    }
}
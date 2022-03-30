// Constants
import { queryableDTsFields } from "../constants/constants";

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
        console.log("error");
        return dts;
    }
}
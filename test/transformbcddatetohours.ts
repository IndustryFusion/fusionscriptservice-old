import { isObject, TransformResult, JSONRoot, JSONObject, isNumber, bcdToInt } from "./util.ts"
import { datetime } from "./deps.ts"

export function transform(data: JSONRoot): TransformResult {
    if (!isObject(data)) {
        return { status: 400, statusText: "Only JSON objects supported" };
    }
    const objectData = data as JSONObject;

    if ('Jahr_Folgewartung' in objectData && 'MonatTag_Folgewartung' in objectData) {
        if (!isNumber(objectData['Jahr_Folgewartung'])) {
            return { status: 400, statusText: "SpMonatTag_Folgewartungeed not a number " + objectData['Jahr_Folgewartung'] };
        }
        if (!isNumber(objectData['MonatTag_Folgewartung'])) {
            return { status: 400, statusText: "MonatTag_Folgewartung not a number " + objectData['MonatTag_Folgewartung'] };
        }
        const jahr = objectData['Jahr_Folgewartung'] as number;
        const monatTag = objectData['MonatTag_Folgewartung'] as number;
        const strDate = String(bcdToInt(monatTag)).padStart(4, "0") + String(bcdToInt(jahr) + 2000).padStart(4, "0");
        objectData['Datum_Folgewartung'] = strDate;
        const maintenanceDate = datetime.parse(strDate, "ddMMyyyy")
        objectData['Stunden_Folgewartung'] = datetime.difference(new Date(), maintenanceDate, { units: ["hours"] }).hours as number;
    }

    return { status: 201, data: objectData };
}

import { IRowData } from "./types";

export const calculateTotal = (rows: IRowData[]): IRowData[] => {
    let temp = [...rows];

    temp.forEach((row, rowIndex) => {
        if (row.type === "total") {
            row[2021] = "0";
            row[2022] = "0";
            row[2024] = "0";

            let index = rowIndex - 1;
            let flag = true;

            while (flag && index >= 0) {
                if (temp[index].type === "value") {
                    row[2021] = String((Number(temp[index][2021]) + Number(row[2021])).toFixed(2));
                    row[2022] = String((Number(temp[index][2022]) + Number(row[2022])).toFixed(2));
                    row[2024] = String((Number(temp[index][2024]) + Number(row[2024])).toFixed(2));
                } else if (temp[index].type === "Header") {
                    flag = false;
                }
                index--;
            }
        }
    });

    return [...temp];
}

export const calculateVariance = (rows: IRowData[]): IRowData[] => {
    let temp = [...rows];
    temp.forEach((row: IRowData) => {
        if (row.type == "value") {
            row["variance"] = String((Number(row[2024]) - Number(row[2022])).toFixed(2));
        }
    })
    return temp
}

export const calculateVariancePercent = (rows: IRowData[]): IRowData[] => {
    let temp = [...rows];
    temp.forEach((row: IRowData) => {
        if (row.type == "value") {
            let variance = Number(row[2024]) - Number(row[2022])
            let variancePercent = variance / Number(row[2022]);

            row["variance-percent"] = variancePercent ? String((variancePercent).toFixed(2)) + "%" : "0%";
        }
    })
    return temp
}   

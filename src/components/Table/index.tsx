import { AgGridReact } from "ag-grid-react";
import { CellValueChangedEvent, ColDef, ICellRendererParams, ValueSetterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useEffect, useState } from "react";
import { initialRowData } from "./data";
import { IRowData } from "../../types";
import { IoMdAddCircle } from "react-icons/io";
import { calculateTotal, calculateVariance, calculateVariancePercent } from "../../utils";

const Table = () => {

    const [rowData, setRowData] = useState<IRowData[]>(initialRowData);

    function addRowAfterIndex(index: number, newRow: IRowData, prev: IRowData[]) {
        const updatedRowData = [...prev];
        updatedRowData.splice(index + 1, 0, newRow);
        return updatedRowData;
    }

    const handleCellValueChange = (params: CellValueChangedEvent) => {
        const updatedRowData = [...rowData];
        const index = updatedRowData.findIndex(row => row.id === params.data.id);
        if (index >= 0) {
            updatedRowData[index] = params.data;
            setRowData(updatedRowData);
            handleCalculations()
        }
    };

    useEffect(() => {
        handleCalculations()
    }, [])

    const handleCalculations = () => {
        setRowData(prev => calculateTotal(prev))
        setRowData(prev => calculateVariance(prev))
        setRowData(prev => calculateVariancePercent(prev))
    }

    function handleAddRow(id: number): void {
        const newRow: IRowData = {
            id: Date.now(),
            million: "new row",
            "2021": "0",
            "2022": "0",
            "2024": "0",
            variance: "",
            "variance-percent": "",
            type: "value",
            edit: true,
            isCustom: true
        };
        setRowData(prev => {
            return addRowAfterIndex(prev.findIndex(row => row.id === id), newRow, prev);
        });
        handleCalculations()
    }

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<ColDef[]>([
        {
            headerName: "(Million)",
            field: "million",
            editable: (params) => params.data.isCustom,
            cellClass: (params) => (params.data.type === "Header" ? "font-bold " : "font-normal"),
            cellRenderer: (params: ICellRendererParams) => {
                if (params.data.isAddable) {
                    return (
                        <div className="flex items-center gap-4" >
                            {params.value}
                            <button onClick={() => handleAddRow(params.data.id)}>
                                <IoMdAddCircle size={15} />
                            </button>
                        </div>
                    );
                }
                return (<div>{params.value}</div>);
            },
        },
        {
            headerName: "31-12-2021",
            field: "2021",
            editable: (params) => params.data.isCustom,
            valueSetter: params => {
                const newValue = Number(params.newValue);
                if (!isNaN(newValue)) {
                    if (params.colDef.field) {
                        params.data[params.colDef.field] = newValue.toString();
                    }
                    return true;
                }
                return false;
            },
            valueParser: params => {
                const newValue = Number(params.newValue);
                return isNaN(newValue) ? params.oldValue : newValue;
            },
            cellRenderer: (params: ICellRendererParams) => {
                if (params.data.type == "total") {
                    return (<div className="font-bold">{params.value}</div>);
                }
                return (<div>{params.value}</div>);
            },
        },
        {
            headerName: "31-12-2022",
            field: "2022",
            editable: (params) => params.data.isCustom,
            valueSetter: params => {
                const newValue = Number(params.newValue);
                if (!isNaN(newValue)) {
                    if (params.colDef.field) {
                        params.data[params.colDef.field] = newValue.toString();
                    }
                    return true;
                }
                return false;
            },
            valueParser: params => {
                const newValue = Number(params.newValue);
                return isNaN(newValue) ? params.oldValue : newValue;
            },
            cellRenderer: (params: ICellRendererParams) => {
                if (params.data.type == "total") {
                    return (<div className="font-bold">{params.value}</div>);
                }
                return (<div>{params.value}</div>);
            },
        },
        {
            headerName: "31-12-2024",
            field: "2024",
            editable: (params) => params.data.edit,
            valueSetter: params => {
                const newValue = Number(params.newValue);
                if (!isNaN(newValue)) {
                    if (params.colDef.field) {
                        params.data[params.colDef.field] = newValue.toString();
                    }
                    return true;
                }
                return false;
            },
            valueParser: params => {
                const newValue = Number(params.newValue);
                return isNaN(newValue) ? params.oldValue : newValue;
            },
            cellRenderer: (params: ICellRendererParams) => {
                if (params.data.type == "total") {
                    return (<div className="font-bold">{params.value}</div>);
                }
                return (<div>{params.value}</div>);
            },
        },
        {
            headerName: "Variance",
            field: "variance",
            editable: false,
            cellRenderer: (params: ICellRendererParams) => {
                return (<div className={`font-bold ${Number(params.value) < 0 ? "text-red-600" : "text-green-600"}`} >{params.value}</div>);
            }
        },
        {
            headerName: "Variance %",
            field: "variance-percent",
            editable: false,
            cellRenderer: (params: ICellRendererParams) => {
                return (<div className={`font-bold ${Number(params.value) < 0 ? "text-red-600" : "text-green-600"}`} >{params.value}</div>);
            }
        },
    ]);


    return (
        <>
            <div className="p-4 h-[90vh] ag-theme-alpine" >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={{
                        editable: false,
                        sortable: true,
                        resizable: true,
                    }}
                    onGridReady={params => params.api.sizeColumnsToFit()}
                    onCellValueChanged={handleCellValueChange}
                />
            </div>
        </>
    )
}

export default Table


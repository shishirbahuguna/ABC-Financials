import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent, CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useEffect, useState } from "react";
import { initialRowData } from "./data";
import { IRowData } from "../../types";
import { IoMdAddCircle, IoMdSettings } from "react-icons/io";
import { calculateTotal, calculateVariance, calculateVariancePercent, numberFormatter } from "../../utils";
import { FaCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "../Modal";

let iconSize = 18

let tabs = [
    "profit & loss",
    "balance sheet",
    "cash flow",
    "ratios"
]

let actions = [
    {
        name: "add column",
        icon: <IoMdAddCircle size={iconSize} />,
    },
    {
        name: "insert comments",
        icon: <FaCommentDots size={iconSize} />
    },
    {
        name: "update column",
        icon: <IoMdSettings size={iconSize} />
    },
]


const Table = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState("profit & loss");
    const [rowData, setRowData] = useState<IRowData[]>(initialRowData);
    const [selectedCell, setSelectedCell] = useState<{
        data: IRowData;
        colID: string;
    } | null>(null);
    const [comment, setComment] = useState<string>();
    const [comments, setComments] = useState<{ [s: string]: string }>({});

    function addRowAfterIndex(index: number, newRow: IRowData, prev: IRowData[]) {
        const updatedRowData = [...prev];
        updatedRowData.splice(index + 1, 0, newRow);
        return updatedRowData;
    }

    const handleCellValueChange = (params: CellValueChangedEvent) => {
        console.log(params)
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

    useEffect(() => {
        if (isOpen == false) setComment("");
    }, [isOpen])

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
                    return (<div className="font-bold">{numberFormatter(params.value)}</div>);
                }
                return (<div>{numberFormatter(params.value)} {params.data.comments && params.data.comments[2021] && `(${params.data.comments[2021]})`} </div>);
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
                    return (<div className="font-bold">{numberFormatter(params.value)}</div>);
                }
                return (<div>{numberFormatter(params.value)} {params.data.comments && params.data.comments[2022] && `(${params.data.comments[2022]})`}</div>);
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
                    return (<div className="font-bold">{numberFormatter(params.value)}</div>);
                }
                return (<div>{numberFormatter(params.value)} {params.data.comments && params.data.comments[2024] && `(${params.data.comments[2024]})`}</div>);
            },
        },
        {
            headerName: "Variance",
            field: "variance",
            editable: false,
            cellRenderer: (params: ICellRendererParams) => {
                return (<div className={`font-bold ${Number(params.value) < 0 ? "text-red-600" : "text-green-600"}`} >{numberFormatter(params.value)}</div>);
            }
        },
        {
            headerName: "Variance %",
            field: "variance-percent",
            editable: false,
            cellRenderer: (params: ICellRendererParams) => {
                return (<div className={`font-bold ${Number(params.value) < 0 ? "text-red-600" : "text-green-600"}`} >{
                    params.value ? numberFormatter(params.value) + "%" : "-"
                }</div>);
            }
        },
    ]);


    function handleCellClick(event: CellClickedEvent<any, any>): void {
        setSelectedCell({
            data: event.data,
            colID: event.colDef.field as string
        });
        if (event.data.comments && event.data.comments[event.colDef.field as string]) {
            setComment(event.data.comments[event.colDef.field as string]);
        }
    }

    function handleAddComment() {
        if (selectedCell == null) return toast.info("Select a cell first to add a comment");
        if (comment == null || comment.trim() === "") return toast.info("Please enter a comment");
        setRowData((prev) => {
            const updatedRowData = [...prev];
            const index = updatedRowData.findIndex(row => row.id === selectedCell.data.id);
            if (index >= 0) {
                let cmts = {
                    ...updatedRowData[index].comments,
                    [selectedCell.colID]: comment
                }
                updatedRowData[index].comments = cmts
            }
            return updatedRowData;
        });
        setComment("");
        setIsOpen(false);
    }

    function handleAction(action: { name: string; icon: any; }) {
        switch (action.name) {
            case "add column":
                break;
            case "insert comments":
                if (selectedCell == null) return toast.info("Select a cell first to add a comment");
                setIsOpen(true);
                break;
            case "update column":
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div className="header">
                <h1 className="text-lg font-bold" >Financial statements</h1>
                <div className="flex justify-between items-center my-4" >
                    <div className="flex gap-3 items-center" >
                        {tabs.map((tab, index) => (
                            <button key={index} disabled={tab !== active} className={`bg-white capitalize border  px-4 py-1 text-sm rounded cursor-pointer ${tab == active ? "border-red-400 text-red-600 " : "border-gray-400 text-gray-600 "}`}  >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3 items-center" >
                        {
                            actions.map((action, index) => (
                                <button
                                    key={index}
                                    className="bg-white capitalize border px-4 py-1 text-sm rounded cursor-pointer flex gap-2 items-center border-gray-400 text-gray-600 "
                                    onClick={() => handleAction(action)}
                                >
                                    {action.icon}
                                    <span>
                                        {action.name}
                                    </span>
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="body my-4" >
                <div className="p-4 h-[90vh] ag-theme-alpine" >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={colDefs}
                        defaultColDef={{
                            editable: false,
                            sortable: true,
                            resizable: true,
                        }}
                        suppressScrollOnNewData={true}
                        onGridReady={params => params.api.sizeColumnsToFit()}
                        onCellValueChanged={handleCellValueChange}
                        onCellClicked={handleCellClick}
                    />
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="p-4" >
                    <h4 className="text-lg font-bold">Add comment</h4>
                    <textarea
                        className="w-full h-32 p-2 border rounded my-6"
                        placeholder="Add a comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-4" >
                        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => setIsOpen(false)} >
                            Cancel
                        </button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddComment} >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Table


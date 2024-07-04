import { FaCommentDots } from "react-icons/fa"
import { IoMdAddCircle, IoMdSettings } from "react-icons/io"
import Table from "../../components/Table"
import { useState } from "react"

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

const Wrapper = () => {

    const [active, _] = useState("profit & loss");

    return (
        <>
            <div className="container p-4 mx-auto" >
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
                                    <button key={index} className="bg-white capitalize border px-4 py-1 text-sm rounded cursor-pointer flex gap-2 items-center border-gray-400 text-gray-600 " >
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
                    <Table />
                </div>
            </div>
        </>
    )
}

export default Wrapper
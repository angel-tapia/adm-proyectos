import { FaUserPlus } from "react-icons/fa";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import { LuScanFace } from "react-icons/lu";
import './TabBar.css';

export default function TabBar(){
    return (
        <div className="tabs-container">
            <a href="/home">
            <LuScanFace className="icon" />
            </a>

            <a href="/register">
                <FaUserPlus className="icon" />
            </a>

            <a href="/reports">
                <BsFillFileBarGraphFill className="icon" />
            </a>
        </div>
    );
}
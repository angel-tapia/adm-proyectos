import { FaUserPlus } from 'react-icons/fa';
import { BsFillFileBarGraphFill } from 'react-icons/bs';
import { LuScanFace } from 'react-icons/lu';
import './TabBar.css';
import { Link } from 'react-router-dom';

export default function TabBar() {
  return (
    <div className="tabs-container">

      <Link to="/home">
        <LuScanFace className="icon" />
      </Link>
      
      <Link to="/register">
        <FaUserPlus className="icon" />
      </Link>
      
      <Link to="/reports">
        <BsFillFileBarGraphFill className="icon" />
      </Link>
    </div>
  );
}

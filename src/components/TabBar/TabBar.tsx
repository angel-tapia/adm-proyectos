import { FaUser } from 'react-icons/fa';
import { BsFillFileBarGraphFill } from 'react-icons/bs';
import { LuScanFace } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import './TabBar.css';

export default function TabBar() {
  return (
    <div className="tabs-container">

      <Link to="/home">
        <LuScanFace className="icon" />
      </Link>
      
      <Link to="/employees">
        <FaUser className='icon' />
      </Link>
      
      <Link to="/reports">
        <BsFillFileBarGraphFill className="icon" />
      </Link>
    </div>
  );
}

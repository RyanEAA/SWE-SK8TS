import react from 'react';
import { NavLink } from 'react-router-dom';
import '../css/OrdersTabBar.css';

function OrdersTabBar(){
    return (
        <nav className='tab-bar'>
            <NavLink to='/OrderDashboard' className='tab-bar-link'>Unclaimed Orders</NavLink>
            <NavLink to='/ClaimedPackages' className='tab-bar-link'>Claimed Orders</NavLink>
        </nav>
    );
}

export default OrderTabBar;
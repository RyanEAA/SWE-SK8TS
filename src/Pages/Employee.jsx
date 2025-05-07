import React, { useState } from 'react';
import '../css/admin/Admin.css';
import ClaimedOrders from '../Components/AdminComponents/ClaimedOrders';
import AllOrders from '../Components/AdminComponents/AllOrders';
import AdminTabs from '../Components/AdminComponents/AdminTabs';

function Employee() {
    const [activeTab, setActiveTab] = useState('claimedOrders');

    return (
        <div className="admin-tabs">
            <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'claimedOrders' && (
                <ClaimedOrders />
            )}

            {activeTab === 'orders' && (
                <AllOrders />
            )}
        </div>
    );
}

export default Employee;
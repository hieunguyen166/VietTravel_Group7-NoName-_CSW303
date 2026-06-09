import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const AdminDashboard = () => {
    const { token, backendUrl } = useContext(AppContext);
    
    // Khởi tạo state với các trường mới để tránh lỗi undefined khi render
    const [stats, setStats] = useState({ 
        totalCars: 0, 
        totalBookings: 0, 
        totalRevenue: 0, 
        totalAdminCommission: 0, 
        totalOwnerAmount: 0 
    });

    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setStats(data.stats); // Đảm bảo Backend trả về object có chứa các trường này
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        }
    };

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black text-gray-800 mb-8 font-mplus">Admin Overview</h1>
            
            {/* Hàng 1: Chỉ số hoạt động */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Tổng số xe", value: stats.totalCars, color: "text-blue-600" },
                    { label: "Tổng đơn hàng", value: stats.totalBookings, color: "text-purple-600" },
                    { label: "Tổng doanh thu", value: `${stats.totalRevenue.toLocaleString()} đ`, color: "text-gray-800" },
                    { label: "Doanh thu chủ xe", value: `${stats.totalOwnerAmount.toLocaleString()} đ`, color: "text-orange-600" }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{item.label}</p>
                        <p className={`text-2xl font-black mt-2 ${item.color}`}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Hàng 2: Hoa hồng Admin (Nổi bật nhất) */}
            <div className="bg-[#115E59] p-8 md:p-12 rounded-3xl shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold opacity-90">Lợi nhuận Admin (Hoa hồng 5%)</h2>
                    <p className="text-sm opacity-70 mt-1">Tổng cộng các khoản phí dịch vụ trên toàn hệ thống</p>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-5xl md:text-6xl font-black tracking-tight">{stats.totalAdminCommission.toLocaleString()} <span className="text-2xl opacity-70">đ</span></p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
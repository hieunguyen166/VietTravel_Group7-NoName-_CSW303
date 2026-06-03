import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";


const Dashboard = () => {
    const { axios, isOwner, currency } = useAppContext();

    const [data, setData] = useState({
        totalCars: 0,
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        recentBookings: [],
        monthlyRevenue: 0,
    });

    const dashboardCards = [
        { title: "Tổng Số Xe", value: data?.totalCars ?? 0, icon: assets.carIconColored },
        { title: "Tổng Đơn Đặt", value: data?.totalBookings ?? 0, icon: assets.listIconColored },
        { title: "Chờ Xác Nhận", value: data?.pendingBookings ?? 0, icon: assets.cautionIconColored },
        { title: "Đã Xác Nhận", value: data?.completedBookings ?? 0, icon: assets.listIconColored },
    ];

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/owner/dashboard');
            if (data.success) {
                setData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isOwner) {
            fetchDashboardData()
        }
    }, [isOwner])

    return (
        <div className='px-4 pt-10 md:px-10 flex-1 font-bevietnam antialiased'>
            <Title title="Bảng Điều Khiển" subTitle="Theo dõi hiệu suất tổng thể của nền tảng bao gồm số lượng xe niêm yết, tình trạng đặt xe, doanh thu và các hoạt động gần đây." />

            {/* Khối thẻ báo cáo nhanh */}
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-4xl'>
                {dashboardCards.map((card, index) => (
                    <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-xl border border-borderColor bg-white shadow-sm hover:shadow-md transition-all duration-300'>
                        <div>
                            <h1 className='text-xs font-bold text-gray-400 uppercase tracking-wider'>{card.title}</h1>
                            <p className='text-2xl font-mplus font-bold text-gray-900 mt-1'>{card.value}</p>
                        </div>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[#115E59]/10'>
                            <img src={card.icon} alt="" className='h-4 w-4' />
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
                {/* Đơn đặt xe gần đây */}
                <div className='p-5 border border-borderColor rounded-xl max-w-xl flex-1 bg-white shadow-sm'>
                    <h1 className='text-lg font-bold text-gray-900'>Đơn Đặt Gần Đây</h1>
                    <p className='text-xs text-gray-400 mb-4 font-medium'>Danh sách các lượt đặt xe mới nhất từ khách hàng</p>
                    
                    <div className="divide-y divide-gray-100">
                        {data?.recentBookings && data.recentBookings.length > 0 ? (
                            data.recentBookings.map((item, index) => {
                                // Đổi tên biến chạy từ `booking` sang `item` để ép trình duyệt xóa bỏ hoàn toàn tham chiếu cũ
                                if (!item) return null;

                                return (
                                    <div key={index} className='py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0'>
                                        <div className='flex items-center gap-3'>
                                            <div className='hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#115E59]/5 shrink-0'>
                                                <img src={assets.listIconColored} alt="" className='h-4 w-4' />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">
                                                    {item.car?.brand || "Xe"} {item.car?.model || "Không xác định"}
                                                </p>
                                                <p className='text-xs font-mplus font-semibold text-gray-400 mt-0.5'>
                                                    {item.createdAt ? item.createdAt.split('T')[0] : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3 font-medium shrink-0'>
                                            <p className='text-sm font-mplus font-bold text-gray-700'>
                                                {(item.price ?? 0).toLocaleString()} {currency}
                                            </p>
                                            <p className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold tracking-wide ${
                                                item.status === 'Pending' || item.status === 'Chờ xác nhận'
                                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                            }`}>
                                                {item.status === 'Pending' ? 'Chờ duyệt' : item.status === 'Confirmed' ? 'Đã duyệt' : item.status}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">Chưa có đơn đặt xe nào gần đây.</p>
                        )}
                    </div>
                </div>

                {/* Doanh thu tháng này */}
                <div className='p-5 mb-6 border border-borderColor rounded-xl w-full md:max-w-xs bg-white shadow-sm flex flex-col justify-between'>
                    <div>
                        <h1 className='text-lg font-bold text-gray-900'>Doanh Thu Tháng</h1>
                        <p className='text-xs text-gray-400 font-medium'>Tổng doanh thu ghi nhận trong tháng hiện tại</p>
                    </div>
                    <p className='text-3xl mt-8 font-mplus font-extrabold text-[#115E59] tracking-tight'>
                        {(data?.monthlyRevenue ?? 0).toLocaleString()} <span className="text-lg font-bold opacity-80">{currency}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
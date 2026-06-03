import Title from './Title'; // Đảm bảo đường dẫn import component Title này là chính xác trong dự án của bạn

const Testimonial = () => {
    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            handle: '@neilstellar',
            date: '20 Tháng 4, 2026', // Việt hóa định dạng ngày tháng đồng bộ năm hiện tại
            stars: 5 
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            handle: '@averywrites',
            date: '10 Tháng 5, 2026',
            stars: 5
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            handle: '@jordantalks',
            date: '05 Tháng 6, 2026',
            stars: 5
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Thanh Hải',
            handle: '@haiwrites',
            date: '15 Tháng 5, 2026',
            stars: 5
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-5 rounded-2xl mx-3 shadow-[0_4px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition-all duration-300 w-80 shrink-0 bg-white border border-gray-50 flex flex-col justify-between">
            <div>
                <div className="flex gap-3">
                    <img className="size-11 rounded-full object-cover" src={card.image} alt="User Image" />
                    <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-1">
                            {/* TÊN KHÁCH HÀNG: font-mplus font-bold giúp tên hiển thị gọn gàng, sắc nét */}
                            <p className="font-mplus font-bold text-gray-900 text-sm">{card.name}</p>
                            <svg className="mt-0.5" width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Đổi màu tích xanh xác thực sang màu xanh thương hiệu #115E59 */}
                                <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#115E59" />
                            </svg>
                        </div>
                        
                        {/* ĐÁNH GIÁ CHẤM SAO */}
                        <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(card.stars || 5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* COMMENT TIẾNG VIỆT: Sử dụng nền font-bevietnam giúp chữ mềm mại, tự nhiên */}
                <p className="text-sm py-3.5 text-gray-600 leading-relaxed font-medium">
                    "Dịch vụ thuê xe tuyệt vời! Xe đời mới, sạch sẽ và vận hành rất êm ái. Thủ tục giao nhận xe nhanh chóng, nhân viên hỗ trợ nhiệt tình. Chắc chắn tôi sẽ tiếp tục lựa chọn VietTrav cho những chuyến đi tiếp theo cùng gia đình."
                </p>
            </div>
            
            {/* PHẦN ĐĂNG TẢI TRÊN VIETTRAV */}
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium pt-1">
                <div className="flex items-center gap-1">
                    <span>Đăng tại</span>
                    {/* Đồng bộ font-mplus kèm mã màu thương hiệu thẫm #115E59 */}
                    <span className="font-mplus font-bold text-[#115E59] tracking-tight">VietTrav</span>
                </div>
                <p className="font-mplus font-semibold">{card.date}</p>
            </div>
        </div>
    );

    return (
        /* font-bevietnam bọc ngoài tạo cảm giác đồng bộ, sang trọng */
        <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden w-full font-bevietnam">
            {/* VIỆT HÓA TIÊU ĐỀ TITLE COMPONENT */}
            <Title 
                title="Khách Hàng Nói Gì Về Chúng Tôi" 
                subTitle="Khám phá lý do vì sao những khách hàng thông thái luôn tin tưởng và lựa chọn VietTrav cho những trải nghiệm lái xe sang trọng trên khắp mọi miền đất nước." 
            />

            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }

                .marquee-inner {
                    animation: marqueeScroll 30s linear infinite;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>

            <div className="mt-14 space-y-2">
                {/* Hàng 1 */}
                <div className="marquee-row w-full overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-24 md:w-44 z-10 pointer-events-none bg-gradient-to-r from-[#f8faff] to-transparent"></div>
                    <div className="marquee-inner flex transform-gpu min-w-[200%] pt-6 pb-4">
                        {[...cardsData, ...cardsData].map((card, index) => (
                            <CreateCard key={`row1-${index}`} card={card} />
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 h-full w-24 md:w-44 z-10 pointer-events-none bg-gradient-to-l from-[#f8faff] to-transparent"></div>
                </div>

                {/* Hàng 2 */}
                <div className="marquee-row w-full overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-24 md:w-44 z-10 pointer-events-none bg-gradient-to-r from-[#f8faff] to-transparent"></div>
                    <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-6 pb-4">
                        {[...cardsData, ...cardsData].map((card, index) => (
                            <CreateCard key={`row2-${index}`} card={card} />
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 h-full w-24 md:w-44 z-10 pointer-events-none bg-gradient-to-l from-[#f8faff] to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;
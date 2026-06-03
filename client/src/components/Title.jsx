const Title = ({ title, subTitle, align }) => {
  return (
    /* Dùng font-bevietnam làm nền tảng tổng thể để các dòng chữ tiếng Việt hiển thị mượt mà */
    <div className={`flex flex-col justify-center items-center text-center font-bevietnam ${align === "left" ? "md:items-start md:text-left" : ""}`}>
        {/* TIÊU ĐỀ CHÍNH: Chuyển sang font-mplus font-extrabold giúp các cụm từ in hoa/thương hiệu vuông vức, nổi bật và hiện đại */}
        <h1 className='font-mplus font-extrabold text-4xl md:text-[40px] text-gray-900 tracking-tight leading-tight'>
            {title}
        </h1>
        {/* PHỤ ĐỀ: Thừa hưởng font-bevietnam giúp người dùng đọc thông tin mô tả dài một cách dễ chịu, rõ ràng */}
        <p className='text-sm md:text-base text-gray-500/90 mt-2.5 max-w-156 font-medium tracking-wide leading-relaxed'>
            {subTitle}
        </p>
    </div>
  )
}

export default Title
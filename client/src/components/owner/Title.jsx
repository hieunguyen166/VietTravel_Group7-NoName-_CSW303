
export const Title = ({ title, subTitle }) => {
    return (
        <div className="mb-6">
            {/* Hiển thị tiêu đề chính lớn, đậm */}
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                {title}
            </h1>
            
            {/* Hiển thị dòng mô tả nhỏ phía dưới */}
            {subTitle && (
                <p className="text-sm text-gray-500 mt-1 md:text-base">
                    {subTitle}
                </p>
            )}
        </div>
    );
};

export default Title
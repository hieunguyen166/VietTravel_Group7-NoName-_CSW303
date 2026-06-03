import React from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const Login = () => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            const { data } = await axios.post(`/api/user/${state}`, { name,
            email, password })

            if (data.success) {
                navigate('/')
                setToken(data.token)
                localStorage.setItem('token', data.token)
                setShowLogin(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div 
            onClick={() => setShowLogin(false)} 
            className='fixed inset-0 z-50 flex items-center justify-center text-base text-gray-600 bg-black/60 backdrop-blur-sm antialiased'
        >
            <form 
                onClick={(e) => e.stopPropagation()} 
                onSubmit={onSubmitHandler}
                /* Dùng font-bevietnam làm lớp nền mượt mà cho toàn bộ text tiếng Việt bên trong */
                className="flex flex-col gap-5 m-auto items-start p-8 py-10 md:p-10 md:py-12 w-full max-w-xl text-gray-500 rounded-2xl shadow-2xl border border-gray-100 bg-white mx-4 font-bevietnam"
            >
                {/* TIÊU ĐỀ FORM: Việt hóa nghệ thuật hoàn toàn + Kết hợp font-mplus vuông vức, khỏe khoắn */}
                <p className="text-3xl md:text-4xl font-mplus font-black m-auto text-gray-900 tracking-tight select-none">
                    {state === "login" ? (
                        <>Đăng <span className="text-[#115E59]">Nhập</span></>
                    ) : (
                        <>Đăng <span className="text-[#115E59]">Ký</span></>
                    )}
                </p>

                {state === "register" && (
                    <div className="w-full animate-fade-in">
                        <p className="font-bold text-gray-800 text-sm md:text-base tracking-tight">Họ và tên</p>
                        <input 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            placeholder="Nhập họ và tên của bạn" 
                            className="border border-gray-300 rounded-lg w-full p-3 mt-1.5 text-base outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 placeholder:text-gray-400 font-bold" 
                            type="text" 
                            required 
                        />
                    </div>
                )}

                <div className="w-full">
                    <p className="font-bold text-gray-800 text-sm md:text-base tracking-tight">Email</p>
                    {/* font-mplus giúp địa chỉ email và các ký tự đặc biệt (@, .) hiển thị cực kỳ rõ nét */}
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        placeholder="example@gmail.com" 
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1.5 text-base outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 placeholder:text-gray-400 font-mplus font-bold tracking-tight" 
                        type="email" 
                        required 
                    />
                </div>

                <div className="w-full">
                    <p className="font-bold text-gray-800 text-sm md:text-base tracking-tight">Mật khẩu</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        placeholder="Nhập mật khẩu của bạn" 
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1.5 text-base outline-none focus:border-[#115E59] focus:ring-4 focus:ring-teal-900/5 transition-all text-gray-900 placeholder:text-gray-400 font-bold" 
                        type="password" 
                        required 
                    />
                </div>

                {/* CHUYỂN ĐỔI TRẠNG THÁI */}
                {state === "register" ? (
                    <p className="text-gray-500 text-sm md:text-base font-medium tracking-tight">
                        Bạn đã có tài khoản?{' '}
                        <span onClick={() => setState("login")} className="text-[#115E59] font-bold cursor-pointer hover:underline ml-0.5">
                            Đăng nhập ngay
                        </span>
                    </p>
                ) : (
                    <p className="text-gray-500 text-sm md:text-base font-medium tracking-tight">
                        Bạn chưa có tài khoản?{' '}
                        <span onClick={() => setState("register")} className="text-[#115E59] font-bold cursor-pointer hover:underline ml-0.5">
                            Tạo tài khoản mới
                        </span>
                    </p>
                )}

                {/* NÚT SUBMIT: Dùng màu thương hiệu thẫm, hover sáng lên mượt mà trên nền font-mplus dứt khoát */}
                <button type="submit" className="bg-[#115E59] hover:bg-[#0D9488] transition-all text-white w-full py-3.5 rounded-xl cursor-pointer font-mplus font-bold text-base md:text-lg shadow-md shadow-teal-900/10 mt-2 active:scale-[0.99] tracking-wider uppercase">
                    {state === "register" ? "Đăng ký tài khoản" : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
};

export default Login;
import { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useLocation } from 'react-router-dom';
import { assets, ownerMenuLinks } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {

    const { user, axios, fetchUser } = useAppContext();
    const location = useLocation()
    const [image, setImage] = useState('')

    const updateImage = async () => {
        try {
            const formData = new FormData()
            formData.append('image', image)

            const { data } = await axios.post('/api/owner/update-image', formData)

            if(data.success){
                await fetchUser() 
                toast.success(data.message)
                setImage('')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>
            <div className='group relative flex justify-center items-center'>
                <label htmlFor="image" className="cursor-pointer relative block w-40 h-40">
                    {/* Tăng kích thước lên w-40 h-40 và XÓA BỎ border thừa */}
                    <img 
                        src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"} 
                        alt="Avatar" 
                        className='w-full h-full rounded-full mx-auto aspect-square object-cover' 
                    />
                    <input type="file" id='image' accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />

                    {/* Lớp phủ Hover: Sử dụng w-full h-full để luôn khít tuyệt đối với label chứa ảnh */}
                    <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/40 rounded-full group-hover:flex items-center justify-center w-full h-full mx-auto aspect-square transition-all duration-200'>
                        <img src={assets.edit_icon} alt="Edit" className='w-6 h-6 invert brightness-200' />
                    </div>
                </label>
            </div>

            {image && (
                <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer rounded text-xs items-center z-10' onClick={updateImage} >
                    Save <img src={assets.check_icon} width={13} alt="" />
                </button>
            )}

            <p className='mt-4 text-base font-medium max-md:hidden'>{user?.user || user?.name}</p>
            
            <div className='w-full mt-6'>
                {ownerMenuLinks.map((link, index) => (
                    <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'}`}>
                        <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="car icon" />
                        <span className='max-md:hidden'>{link.name}</span>
                        <div className={`${link.path === location.pathname && 'bg-primary'} w-1.5 h-8 rounded-l right-0 absolute`}></div>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Sidebar;
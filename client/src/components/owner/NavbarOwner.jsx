import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

export default function NavbarOwner() {

    const user = useAppContext()

    return (
        
        <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all w-full bg-white font-bevietnam antialiased'>
            
            
            <Link to='/' className="flex items-center">
                <img 
                    src={assets.logo2} 
                    alt="Logo" 
                    className="h-10 md:h-12 w-auto object-contain transition-all duration-300"
                />
            </Link>
            
            
            <p className="text-sm font-medium text-gray-400">
                Chào mừng quay trở lại, <span className="font-mplus font-bold text-[#115E59] text-base">{user?.name || "Chủ xe"}</span>
            </p>
            
        </div>
    )
}
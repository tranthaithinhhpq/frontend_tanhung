import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';

const Home = () => {
    const { user } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!user.isLoading && !user.isAuthenticated) {
            history.push('/admin/login');
        }
    }, [user, history]);

    if (user.isLoading) {
        return <div className="container mt-4">Đang kiểm tra xác thực...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Chào mừng đến trang Admin</h2>
        </div>
    );
};

export default Home;

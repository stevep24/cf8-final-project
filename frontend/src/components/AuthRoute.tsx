import { Navigate } from "react-router";

type Props = {
    children: JSX.Element;
};

const AuthRoute = ({ children }: Props) => {
    const token = localStorage.getItem("access");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AuthRoute;

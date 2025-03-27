import { Route, Switch } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './components/home';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Klass from './components/klass/klass'
import Register from './components/register';
import ForgotPassword from './components/forgotpassword';
import ResetPassword from './components/resetpassword';
import NotFound from './components/NotFound';
import Navbar from './components/navbar/navbar';
import { useRecoilValue } from 'recoil';
import { isLoggedIn } from './atoms';

function App() {

    const log = useRecoilValue(isLoggedIn);

    return (
        <>
            <CssBaseline />
            <Navbar />
            <Switch>
                <Route path="/" component={Home} exact />

                <Route path="/dashboard" component={log ? Dashboard : Login} exact />
                <Route path="/klass/:classId" component={log ? Klass : Login} exact />

                <Route path="/register" component={log ? Dashboard : Register} exact />
                <Route path="/login" component={log ? Dashboard : Login} exact />
                <Route path="/forgot-password" component={log ? Dashboard : ForgotPassword} exact />
                <Route path="/reset-password%3ftoken_valid%3dTrue%26message%3dCredentials_Valid/:uidb64/:token" component={log ? Dashboard : ResetPassword} />

                <Route component={NotFound} />
            </Switch>
        </>
    );
}

export default App;
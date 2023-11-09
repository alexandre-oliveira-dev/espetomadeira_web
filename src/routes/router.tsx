import { Switch, Route } from 'react-router-dom'
import Home from '../pages/home'
import Realeases from '../pages/realeases'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';

export default function RouterApp() {
    return(
        <Switch> 
            <QueryParamProvider adapter={ReactRouter5Adapter}>
            <Route exact path={'/'} component={Home}></Route>
            <Route exact path={'/lancamentos'} component={Realeases}></Route>
        </QueryParamProvider>
        </Switch>
    )
}
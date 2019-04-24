import URLS from './URLS';
import connector from './connector';
import StorageHelper from '../helper/StorageHelper';
import {getMetaBaseURL} from "../service/FetchURL";
const Api = new connector(URLS.API);
const Qnotify = new connector(URLS.QNOTIFY);
const Qweed = new connector(URLS.QWEED);
const QAnalytics = new connector(URLS.QANALYTICS);

const QuezxConnection = {
    setEmitter(emitter) {
        Api.setEmitter(emitter);
        Qnotify.setEmitter(emitter);
    },
    login({username, password}) {
        return Api.formUrlEncoded('/oauth/token',
            {username, password, grant_type: 'password'},
            connector.clientHeaders()
        ).then(data => {
            StorageHelper.saveToken(data);
            return this.userInfo();
        });
    },
    getMetaBaseURL(id,dashboardId,metaBaseUrl){
        return QAnalytics.get(`/api/dashboard/${id}?dashboard_id=${dashboardId}&metabaseUrl=${metaBaseUrl}`)
    },
};

import { Protocol } from '../../../shared/Protocol'

const api: Protocol.HelperApi = {
    version() {
        return "1.2"
    }
}

export default api
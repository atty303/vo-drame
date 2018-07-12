import { Protocol } from '../../../shared/Protocol'
import helperApi from './HelperApi'
import projectApi from './ProjectApi'

const api: Protocol.Api = {
    helper: helperApi,
    project: projectApi,
}

export default api
